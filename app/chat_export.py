import sqlite3
import json
import argparse
import sys
import os
from datetime import datetime

def connect_db(db_path):
    """Connects to the SQLite database in read-only mode."""
    try:
        # uri=True and mode=ro for read-only to prevent accidental writes
        conn = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)

def get_user_map(conn):
    """
    Creates a mapping of ServiceId/UUID -> Display Name.
    Querying the 'conversations' table allows us to resolve contact names.
    """
    user_map = {}
    try:
        cursor = conn.cursor()
        # Fetch profile info from conversations table
        # Columns may vary slightly by version, but these are standard for Desktop
        cursor.execute("SELECT serviceId, id, profileFullName, profileName, name, e164 FROM conversations")
        rows = cursor.fetchall()
        
        for row in rows:
            # Hierarchy of best available name
            display_name = (
                row['name'] or 
                row['profileFullName'] or 
                row['profileName'] or 
                row['e164'] or 
                "Unknown User"
            )
            
            # Map both UUID (id) and ServiceId to the name for robust lookup
            if row['serviceId']:
                user_map[row['serviceId']] = display_name
            if row['id']:
                user_map[row['id']] = display_name
                
    except sqlite3.Error as e:
        print(f"Warning: Could not build full user map: {e}")
    
    return user_map

def find_conversation(conn, search_term):
    """
    Finds a conversation ID by fuzzy searching the name.
    If multiple are found, asks the user to choose.
    """
    cursor = conn.cursor()
    query = """
        SELECT id, name, profileFullName, type 
        FROM conversations 
        WHERE name LIKE ? OR profileFullName LIKE ? OR profileName LIKE ?
    """
    search_pattern = f"%{search_term}%"
    cursor.execute(query, (search_pattern, search_pattern, search_pattern))
    results = cursor.fetchall()
    
    if not results:
        print(f"No conversation found matching '{search_term}'")
        sys.exit(1)
    
    if len(results) > 1:
        print(f"\nFound {len(results)} matching conversations for '{search_term}':")
        for idx, row in enumerate(results):
            name = row['name'] or row['profileFullName'] or "Unknown"
            print(f"{idx + 1}. {name} (ID: {row['id']})")
        
        try:
            selection = int(input(f"Select a conversation for '{search_term}' (number): ")) - 1
            if 0 <= selection < len(results):
                return results[selection]['id'], results[selection]['name'] or results[selection]['profileFullName']
            else:
                print("Invalid selection")
                sys.exit(1)
        except ValueError:
            print("Invalid input")
            sys.exit(1)
            
    return results[0]['id'], results[0]['name'] or results[0]['profileFullName']

def export_chat(db_path, search_terms, start_date=None, end_date=None, output_file=None):
    conn = connect_db(db_path)
    user_map = get_user_map(conn)
    
    target_conversations = [] # List of dicts: {id, name}
    convo_id_map = {} # Map id -> name for quick lookup
    
    print("--- Locating Conversations ---")
    for term in search_terms:
        c_id, c_name = find_conversation(conn, term)
        # Avoid duplicates if user typed the same chat twice or searches overlapped
        if c_id not in convo_id_map:
            target_conversations.append({'id': c_id, 'name': c_name})
            convo_id_map[c_id] = c_name
            print(f"Selected: {c_name}")
        else:
            print(f"Skipping duplicate selection: {c_name}")

    if not target_conversations:
        print("No conversations selected.")
        sys.exit(1)

    print("\n--- Exporting Messages ---")
    
    # Build query with IN clause
    placeholders = ','.join(['?'] * len(target_conversations))
    query = f"SELECT sent_at, sourceServiceId, body, json, type, conversationId FROM messages WHERE conversationId IN ({placeholders})"
    
    # Prepare parameters: conversation IDs first
    params = [c['id'] for c in target_conversations]
    
    if start_date:
        start_ts = datetime.strptime(start_date, "%Y-%m-%d").timestamp() * 1000
        query += " AND sent_at >= ?"
        params.append(start_ts)
        
    if end_date:
        # Include the entire end date by setting limit to next day at 00:00
        end_dt = datetime.strptime(end_date, "%Y-%m-%d")
        end_ts = (end_dt.timestamp() + 86400) * 1000 
        query += " AND sent_at < ?"
        params.append(end_ts)
        
    query += " ORDER BY sent_at ASC"
    
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    messages = []
    
    for row in rows:
        timestamp = row['sent_at']
        if not timestamp:
            continue
            
        dt = datetime.fromtimestamp(timestamp / 1000.0)
        
        # Determine Sender
        sender_id = row['sourceServiceId']
        sender_name = user_map.get(sender_id)
        
        if not sender_name:
            if not sender_id:
                sender_name = "Me" 
            else:
                sender_name = f"Unknown ({sender_id[:6]}...)"

        # Extract Body
        body = row['body']
        has_attachment = False
        
        # Try 'json' blob if body is missing
        if not body and row['json']:
            try:
                json_data = json.loads(row['json'])
                body = json_data.get('body')
                if 'attachments' in json_data and json_data['attachments']:
                    has_attachment = True
            except json.JSONDecodeError:
                pass
        
        # Handle media/empty messages
        if not body:
            if has_attachment:
                body = "[Media Attachment]"
            else:
                continue

        # Build message object
        msg_obj = {
            "timestamp": dt.isoformat(),
            "sender": sender_name,
            "content": body
        }
        
        # Add source conversation context if multiple chats are being exported
        if len(target_conversations) > 1:
            msg_obj["conversation"] = convo_id_map.get(row['conversationId'], "Unknown Chat")

        messages.append(msg_obj)
        
    # Metadata construction
    convo_names_list = [c['name'] for c in target_conversations]
    
    export_data = {
        "metadata": {
            "conversations": convo_names_list,
            "export_generated_at": datetime.now().isoformat(),
            "message_count": len(messages),
            "description": "Signal Messenger conversation log. Messages are chronological and may be interleaved from multiple conversations."
        },
        "messages": messages
    }
    
    if not output_file:
        if len(convo_names_list) == 1:
            base_name = convo_names_list[0]
        else:
            base_name = f"merged_export_{len(convo_names_list)}_chats"
            
        safe_name = "".join([c for c in base_name if c.isalnum() or c in (' ', '-', '_')]).strip()
        output_file = f"{safe_name.replace(' ', '_')}.json"
        
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
        
    print(f"Success! Exported {len(messages)} messages to '{output_file}'")
    conn.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export Signal messages from one or more conversations to a JSON file.")
    parser.add_argument("db_path", help="Path to the decrypted Signal SQLite database")
    # 'nargs='+' allows gathering multiple arguments into a list
    parser.add_argument("conversations", nargs='+', help="Name(s) (or partial names) of the conversations to export")
    parser.add_argument("--start", help="Start date (YYYY-MM-DD)")
    parser.add_argument("--end", help="End date (YYYY-MM-DD)")
    parser.add_argument("--output", help="Output JSON filename (default: auto-generated)")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.db_path):
        print(f"Error: Database file '{args.db_path}' not found.")
        sys.exit(1)
        
    export_chat(args.db_path, args.conversations, args.start, args.end, args.output)