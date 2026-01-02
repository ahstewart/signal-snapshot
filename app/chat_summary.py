import json
import random
from collections import Counter

# Load the data
try:
    with open('Absolute_Units_export.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    messages = data.get('messages', [])
    
    # Count messages per user
    user_counts = Counter()
    user_samples = {}
    
    for msg in messages:
        sender = msg.get('sender')
        content = msg.get('content', '')
        
        if sender:
            user_counts[sender] += 1
            
            # Store a few sample messages to get the vibe
            if sender not in user_samples:
                user_samples[sender] = []
            if content and len(user_samples[sender]) < 50: # Keep a pool to sample from
                user_samples[sender].append(content)

    print(f"Total Messages: {len(messages)}")
    print(f"Unique Members: {len(user_counts)}")
    print("-" * 30)
    
    # Sort by message count
    for user, count in user_counts.most_common():
        print(f"User: {user} | Count: {count}")
        
        # Print 3 random sample messages to understand their vibe
        samples = user_samples.get(user, [])
        if samples:
            print(f"Sample Vibe: {random.sample(samples, min(3, len(samples)))}")
        print("-" * 30)

except Exception as e:
    print(f"Error processing file: {e}")