import os
import json
import base64
import shutil
import win32crypt
from Crypto.Cipher import AES
from pysqlcipher3 import dbapi2 as sqlite # The SQLCipher-enabled library

def get_appdata_path(os="Windows"):
    """Gets the path to AppData\Roaming or AppData\Local."""
    if os == "Windows":
        return os.getenv('APPDATA\Roaming')
    elif os == "Mac":
        return os.getenv('Library/Application Support')
    elif os == "Linux":
        return os.getenv('XDG_CONFIG_HOME', os.path.expanduser('~/.config'))

def get_master_key(os="Windows"):
    # (This function is the same as before)
    print("-> Finding and decrypting master key...")
    try:
        local_state_path = os.path.join(get_appdata_path(os), 'Signal', 'Local State')
        with open(local_state_path, 'r', encoding='utf-8') as f:
            local_state = json.load(f)
        b64_master_key = local_state['os_crypt']['encrypted_key']
        encrypted_master_key_bytes = base64.b64decode(b64_master_key)
        encrypted_master_key = encrypted_master_key_bytes[5:]
        master_key = win32crypt.CryptUnprotectData(encrypted_master_key, None, None, None, 0)[1]
        print("   [SUCCESS] Master key decrypted.")
        return master_key
    except Exception as e:
        print(f"   [ERROR] Failed to get master key: {e}")
        return None

def get_wrapped_db_key(os="Windows"):
    # (This function is the same as before)
    print("-> Finding wrapped database key...")
    try:
        config_path = os.path.join(get_appdata_path(os), 'Signal', 'config.json')
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        wrapped_key_hex = config['key']
        wrapped_key_bytes = bytes.fromhex(wrapped_key_hex)
        print("   [SUCCESS] Found and decoded wrapped key from config.json.")
        return wrapped_key_bytes
    except Exception as e:
        print(f"   [ERROR] Failed to get wrapped database key: {e}")
        return None

def decrypt_db_key(master_key, wrapped_key):
    # (This function is the same as before)
    print("-> Decrypting final database key with AES-256-GCM...")
    try:
        header = wrapped_key[:3]
        nonce = wrapped_key[3:15]
        ciphertext_with_tag = wrapped_key[15:]
        if header not in (b'v10', b'v11'):
            raise ValueError(f"Unexpected header format. Expected 'v10' or 'v11', but got {header.decode('utf-8', 'ignore')}.")
        tag = ciphertext_with_tag[-16:]
        ciphertext = ciphertext_with_tag[:-16]
        cipher = AES.new(master_key, AES.MODE_GCM, nonce=nonce)
        decrypted_key_bytes = cipher.decrypt_and_verify(ciphertext, tag)
        final_key_hex = decrypted_key_bytes.decode('utf-8')
        print("   [SUCCESS] Final database key decrypted.")
        return f"0x{final_key_hex}"
    except Exception as e:
        print(f"   [ERROR] Failed to decrypt final key: {e}")
        return None

def export_decrypted_database(final_key):
    """Uses the final key to decrypt and export the entire database."""
    print("-> Exporting the decrypted database...")
    try:
        db_path = os.path.join(get_appdata_path(os), 'Signal', 'db.sqlite')

        # For user convenience, we'll place the output on their Desktop
        desktop_path = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
        decrypted_db_path = os.path.join(desktop_path, 'decrypted_database.sqlite')

        conn = sqlite.connect(db_path)

        # The SQLCipher command to decrypt and export the database
        export_script = f"""
        PRAGMA key = '{final_key}';
        ATTACH DATABASE '{decrypted_db_path}' AS plaintext KEY '';
        SELECT sqlcipher_export('plaintext');
        DETACH DATABASE plaintext;
        """

        conn.executescript(export_script)
        conn.close()
        print(f"   [SUCCESS] Database exported to your Desktop as 'decrypted_database.sqlite'.")

    except Exception as e:
        print(f"   [ERROR] Failed to export the database. The final key may be wrong or the database file is corrupt.")
        print(f"   Details: {e}")


# --- Main execution block ---
if __name__ == "__main__":
    print("==================================================")
    print("Signal Desktop Database Decryptor & Exporter")
    print("==================================================")

    master_key = get_master_key(os)

    if master_key:
        wrapped_key = get_wrapped_db_key(os)
        if wrapped_key:
            final_key = decrypt_db_key(master_key, wrapped_key)
            if final_key:
                export_decrypted_database(final_key)

    print("\nScript finished.")
    input("Press Enter to exit.")