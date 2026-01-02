import sqlite3
import sys
import os
import shutil

def connect_db(path):
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn

def get_columns(cursor, table_name):
    try:
        cursor.execute(f"PRAGMA table_info({table_name})")
        return [row[1] for row in cursor.fetchall()]
    except:
        return []

def get_tables(cursor):
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    return [row[0] for row in cursor.fetchall() if row[0] not in ['sqlite_sequence', 'schema_migrations']]

def get_conversation_identifier(row):
    if row['type'] == 'private':
        return row['e164'] or row['profileFullName'] or row['profileName']
    else:
        return row['name']

def merge_databases(db1_path, db2_path, output_path):
    # 1. Prepare Output
    if os.path.exists(output_path):
        response = input(f"Output file '{output_path}' already exists. Overwrite? (y/n): ")
        if response.lower() != 'y':
            print("Aborted.")
            return
        os.remove(output_path)

    print(f"Creating '{output_path}' as a copy of '{db1_path}'...")
    shutil.copy2(db1_path, output_path)

    conn_out = connect_db(output_path)
    cursor_out = conn_out.cursor()
    
    # Disable foreign keys for the operation
    cursor_out.execute("PRAGMA foreign_keys = OFF;")

    print(f"Attaching '{db2_path}'...")
    cursor_out.execute(f"ATTACH DATABASE '{db2_path}' AS db2")

    # ---------------------------------------------------------
    # STEP 2: Calculate ID Offset
    # ---------------------------------------------------------
    # We assume 'messages' table exists and uses 'id' as integer primary key (or rowid alias).
    # To prevent collisions (which cause recent messages to be skipped), we shift all DB2 IDs.
    
    print("Calculating ID offsets...")
    try:
        cursor_out.execute("SELECT MAX(id) FROM main.messages")
        max_id_row = cursor_out.fetchone()
        max_msg_id = max_id_row[0] if max_id_row and max_id_row[0] else 0
        id_offset = max_msg_id + 1000 # Add buffer
        print(f"  [Offset] Existing Max Message ID: {max_msg_id}. Will shift DB2 messages by +{id_offset}")
    except Exception as e:
        print(f"  [Warning] Could not determine max message ID (schema might differ): {e}")
        id_offset = 0

    # ---------------------------------------------------------
    # STEP 3: Build Conversation Map
    # ---------------------------------------------------------
    print("Mapping conversations...")
    existing_convos = {}
    cursor_out.execute("SELECT * FROM main.conversations")
    for row in cursor_out.fetchall():
        ident = get_conversation_identifier(row)
        if ident:
            existing_convos[ident] = row['id']

    convo_id_map = {}
    cursor_out.execute("SELECT * FROM db2.conversations")
    db2_convos = cursor_out.fetchall()
    
    for row in db2_convos:
        db2_id = row['id']
        ident = get_conversation_identifier(row)
        
        if ident and ident in existing_convos:
            target_id = existing_convos[ident]
            if db2_id != target_id:
                convo_id_map[db2_id] = target_id
                print(f"  [Merge] Merging chat '{ident}' ({db2_id} -> {target_id})")

    # ---------------------------------------------------------
    # STEP 4: Merge Tables
    # ---------------------------------------------------------
    tables = get_tables(cursor_out)
    
    # Process 'messages' first if possible, but order usually doesn't matter with FKs off
    
    for table in tables:
        # Conversation logic: skip duplicates
        if table == "conversations":
            print("  Syncing conversations table...")
            cols = get_columns(cursor_out, "conversations")
            cols_str = ", ".join(cols)
            excluded_ids = list(convo_id_map.keys())
            if excluded_ids:
                placeholders = ','.join('?' for _ in excluded_ids)
                sql = f"INSERT OR IGNORE INTO main.conversations ({cols_str}) SELECT {cols_str} FROM db2.conversations WHERE id NOT IN ({placeholders})"
                cursor_out.execute(sql, excluded_ids)
            else:
                cursor_out.execute(f"INSERT OR IGNORE INTO main.conversations ({cols_str}) SELECT {cols_str} FROM db2.conversations")
            continue

        print(f"Merging table '{table}'...")
        
        try:
            cols = get_columns(cursor_out, table)
            if not cols: continue
            
            # Determine indices for remapping
            has_convo_id = 'conversationId' in cols
            convo_idx = cols.index('conversationId') if has_convo_id else -1
            
            has_id = 'id' in cols
            id_idx = cols.index('id') if has_id else -1
            
            has_msg_id = 'messageId' in cols
            msg_id_idx = cols.index('messageId') if has_msg_id else -1
            
            # Should we apply the offset to this table?
            # Yes if it's the 'messages' table (affects 'id')
            # Yes if it references messages (affects 'messageId')
            apply_offset_to_id = (table == 'messages' and has_id)
            apply_offset_to_msg_id = (has_msg_id)

            cols_str = ", ".join(cols)
            placeholders = ", ".join(["?"] * len(cols))
            
            cursor_out.execute(f"SELECT {cols_str} FROM db2.{table}")
            
            batch_size = 5000
            while True:
                rows = cursor_out.fetchmany(batch_size)
                if not rows: break
                
                batch_data = []
                for row in rows:
                    data = list(row)
                    
                    # 1. Remap Conversation ID
                    if has_convo_id:
                        orig_cid = data[convo_idx]
                        if orig_cid in convo_id_map:
                            data[convo_idx] = convo_id_map[orig_cid]
                            
                    # 2. Shift Message ID (Primary Key)
                    if apply_offset_to_id:
                        # Assuming ID is integer. If string/uuid, adding int fails, so check type.
                        if isinstance(data[id_idx], int):
                            data[id_idx] += id_offset
                            
                    # 3. Shift Reference Message ID (Foreign Key)
                    if apply_offset_to_msg_id:
                         if isinstance(data[msg_id_idx], int):
                            data[msg_id_idx] += id_offset
                            
                    batch_data.append(data)
                
                # Use REPLACE if we are shifting IDs to ensure we write the "New" version
                # But since we shifted IDs, they should be unique, so INSERT is fine.
                # Standard INSERT OR IGNORE is safer for non-offset tables.
                insert_sql = f"INSERT OR IGNORE INTO main.{table} ({cols_str}) VALUES ({placeholders})"
                cursor_out.executemany(insert_sql, batch_data)

        except Exception as e:
            print(f"Error merging table {table}: {e}")

    # ---------------------------------------------------------
    # STEP 5: Cleanup
    # ---------------------------------------------------------
    conn_out.commit()
    cursor_out.execute("PRAGMA foreign_keys = ON;")
    conn_out.close()
    print(f"\nSuccess! Merged database created at: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python merge_signal_dbs.py <decrypted_db1.sqlite> <decrypted_db2.sqlite> [output.sqlite]")
    else:
        db1 = sys.argv[1]
        db2 = sys.argv[2]
        out = sys.argv[3] if len(sys.argv) > 3 else "merged_signal.db"
        
        if not os.path.exists(db1):
            print(f"Error: File '{db1}' not found.")
        elif not os.path.exists(db2):
            print(f"Error: File '{db2}' not found.")
        else:
            merge_databases(db1, db2, out)