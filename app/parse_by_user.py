import json
import argparse
import sys
import os
from collections import defaultdict

def parse_chat_log(file_path):
    """
    Parses a Signal export JSON and groups messages by user.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error: The file '{file_path}' is not valid JSON.")
        return None

    # This dictionary will hold the data: {'User Name': ['msg1', 'msg2']}
    user_data = defaultdict(list)
    
    # Metadata for context
    metadata = data.get('metadata', {})
    total_messages = metadata.get('message_count', 0)
    
    # FIX: Handle the metadata difference between single-chat and multi-chat exports
    # The new export format uses "conversations" (list) instead of "conversation_name" (string)
    if 'conversations' in metadata:
        convo_names = ", ".join(metadata['conversations'])
        print(f"Processing {total_messages} messages from conversations: {convo_names}...\n")
    elif 'conversation_name' in metadata:
        print(f"Processing {total_messages} messages from: {metadata['conversation_name']}...\n")
    else:
        print(f"Processing {total_messages} messages...\n")

    for msg in data.get('messages', []):
        sender = msg.get('sender')
        content = msg.get('content')

        # FILTER 1: Skip messages without a sender or content
        if not sender or not content:
            continue
            
        # FILTER 2: Clean specific artifacts
        # The '￼' character usually implies an image/sticker that didn't export.
        clean_content = content.replace('￼', '[Attachment/Sticker]').strip()
        
        # Only add non-empty messages
        if clean_content:
            user_data[sender].append(clean_content)

    return user_data

def save_profiles_for_llm(user_data, output_dir="ai_profiles"):
    """
    Formats the grouped data into a text block ready for the LLM prompt.
    """
    if not user_data:
        print("No user data found.")
        return

    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created output directory: {output_dir}/")
        
    print("--- User Statistics ---")
    created_files = []
    
    for user, messages in user_data.items():
        msg_count = len(messages)
        print(f"{user}: {msg_count} messages")

        # Create a formatted string for the LLM
        # We join messages with a newline to save tokens compared to JSON syntax
        llm_input_text = f"User: {user}\nMessages:\n" + "\n".join(f"- {m}" for m in messages)
        
        # Option A: Save to individual files (Great for manual review)
        # Sanitize filename
        safe_username = "".join([c for c in user if c.isalnum() or c in (' ', '-', '_')]).strip().replace(' ', '_')
        if not safe_username:
            safe_username = "unknown_user"
            
        filename = os.path.join(output_dir, f"summary_input_{safe_username}.txt")
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(llm_input_text)
            created_files.append(filename)
        except IOError as e:
            print(f"Error writing file for {user}: {e}")
            
    print(f"\nSuccess! Generated {len(created_files)} text files in '{output_dir}/'.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Parse Signal JSON export and group by user.")
    parser.add_argument("json_file", help="Path to the JSON file exported by signal_chat_export.py")
    
    args = parser.parse_args()
    
    grouped_data = parse_chat_log(args.json_file)
    if grouped_data:
        save_profiles_for_llm(grouped_data)