import sqlite3
import uuid
import sys

# CONFIGURATION
# Path to the "Old" DB (The Source - data you want to take FROM)
SOURCE_DB_PATH = "c:\\Users\\ahste\\Desktop\\units2025_1.sqlite" 
# Path to the "New" DB (The Destination - data you want to add INTO)
DEST_DB_PATH = "c:\\Users\\ahste\\Desktop\\units2025_2.sqlite"

def get_db_connection(db_path):
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to {db_path}: {e}")
        sys.exit(1)

def migrate_data():
    source_conn = get_db_connection(SOURCE_DB_PATH)
    dest_conn = get_db_connection(DEST_DB_PATH)
    dest_cursor = dest_conn.cursor()
    source_cursor = source_conn.cursor()

    # --- FIX FOR "NO SUCH TOKENIZER" ERROR ---
    print("--- Step 0: Temporarily disabling Search Index Triggers ---")
    trigger_name = "messages_on_insert"
    trigger_sql = None
    
    try:
        # 1. Save the original trigger SQL so we can restore it later
        row = dest_cursor.execute("SELECT sql FROM sqlite_master WHERE type='trigger' AND name=?", (trigger_name,)).fetchone()
        if row:
            trigger_sql = row['sql']
            # 2. Drop the trigger to allow insertion without custom tokenizer
            dest_cursor.execute(f"DROP TRIGGER IF EXISTS {trigger_name}")
            print(f"Successfully disabled '{trigger_name}' to allow data merge.")
        else:
            print(f"Warning: Trigger '{trigger_name}' not found. Continuing...")
    except Exception as e:
        print(f"Error manipulating triggers: {e}")
        return

    print("\n--- Step 1: Mapping Conversations by Name ---")
    
    source_conv_map = {} 
    dest_conv_map = {}   
    
    # Map Source Conversations
    rows = source_cursor.execute("SELECT id, name FROM conversations WHERE name IS NOT NULL").fetchall()
    for row in rows:
        source_conv_map[row['name']] = row['id']

    # Map Destination Conversations
    rows = dest_cursor.execute("SELECT id, name FROM conversations WHERE name IS NOT NULL").fetchall()
    for row in rows:
        dest_conv_map[row['name']] = row['id']

    # Create Translation Map
    conv_id_translation = {}
    for name, source_id in source_conv_map.items():
        if name in dest_conv_map:
            dest_id = dest_conv_map[name]
            conv_id_translation[source_id] = dest_id
        else:
            print(f"Skipping '{name}': No match in destination DB.")

    if not conv_id_translation:
        print("No matching conversations found. Exiting.")
        return

    print(f"\n--- Step 2: Migrating Messages ---")
    
    message_id_map = {} 
    
    # Columns to copy (excluding rowid)
    msg_columns_to_copy = [
        'json', 'readStatus', 'expires_at', 'sent_at', 'schemaVersion', 
        'received_at', 'hasAttachments', 'hasFileAttachments', 
        'hasVisualMediaAttachments', 'expireTimer', 'expirationStartTimestamp', 
        'type', 'body', 'messageTimer', 'messageTimerStart', 
        'messageTimerExpiresAt', 'isErased', 'isViewOnce', 'sourceServiceId', 
        'serverGuid', 'sourceDevice', 'storyId', 'isChangeCreatedByUs', 
        'seenStatus', 'storyDistributionListId', 'mentionsMe', 'timestamp', 
        'received_at_ms', 'unidentifiedDeliveryReceived', 'serverTimestamp', 
        'source', 'hasUnreadPollVotes'
    ]
    
    msg_select_query = f"SELECT id, conversationId, {', '.join(msg_columns_to_copy)} FROM messages WHERE conversationId = ?"
    
    msg_insert_query = f"""
        INSERT INTO messages (id, conversationId, {', '.join(msg_columns_to_copy)}) 
        VALUES (?, ?, {', '.join(['?']*len(msg_columns_to_copy))})
    """

    total_msgs = 0
    
    try:
        for source_conv_id, dest_conv_id in conv_id_translation.items():
            messages = source_cursor.execute(msg_select_query, (source_conv_id,)).fetchall()
            
            for msg in messages:
                old_msg_id = msg['id']
                
                # Check for duplicates using sent_at and body
                exists = dest_cursor.execute(
                    "SELECT 1 FROM messages WHERE conversationId = ? AND sent_at = ? AND body = ?", 
                    (dest_conv_id, msg['sent_at'], msg['body'])
                ).fetchone()
                
                if exists:
                    continue

                new_msg_id = str(uuid.uuid4())
                message_id_map[old_msg_id] = new_msg_id
                
                data_values = [new_msg_id, dest_conv_id]
                for col in msg_columns_to_copy:
                    data_values.append(msg[col])
                
                dest_cursor.execute(msg_insert_query, data_values)
                total_msgs += 1
                
        print(f"Migrated {total_msgs} messages.")
        
        print(f"\n--- Step 3: Migrating Reactions ---")
        
        react_columns_to_copy = [
            'emoji', 'fromId', 'messageReceivedAt', 'targetAuthorAci', 
            'targetTimestamp', 'unread', 'timestamp'
        ]
        
        react_select_query = f"SELECT messageId, conversationId, {', '.join(react_columns_to_copy)} FROM reactions WHERE conversationId = ?"
        
        react_insert_query = f"""
            INSERT INTO reactions (messageId, conversationId, {', '.join(react_columns_to_copy)})
            VALUES (?, ?, {', '.join(['?']*len(react_columns_to_copy))})
        """
        
        total_reacts = 0
        
        for source_conv_id, dest_conv_id in conv_id_translation.items():
            reactions = source_cursor.execute(react_select_query, (source_conv_id,)).fetchall()
            
            for react in reactions:
                old_msg_ref = react['messageId']
                
                if old_msg_ref in message_id_map:
                    new_msg_ref = message_id_map[old_msg_ref]
                    
                    data_values = [new_msg_ref, dest_conv_id]
                    for col in react_columns_to_copy:
                        data_values.append(react[col])
                        
                    dest_cursor.execute(react_insert_query, data_values)
                    total_reacts += 1

        print(f"Migrated {total_reacts} reactions.")

        # --- RESTORE TRIGGERS ---
        print("\n--- Step 4: Restoring Search Index Triggers ---")
        if trigger_sql:
            try:
                dest_cursor.execute(trigger_sql)
                print("Trigger restored successfully.")
            except Exception as e:
                print(f"Warning: Could not restore trigger automatically: {e}")
                print("Your messages are safe, but Search might not find the old messages immediately.")
                print("This is normal when doing manual DB merges.")

        # Commit changes
        dest_conn.commit()
        print("\nSUCCESS: Database merge complete.")

    except Exception as e:
        print(f"An error occurred during migration: {e}")
        print("Rolling back changes...")
        dest_conn.rollback()
    finally:
        source_conn.close()
        dest_conn.close()

if __name__ == "__main__":
    migrate_data()