import os
import json
import base64
import shutil
import win32crypt
import platform
import threading
import sys
import tkinter as tk
from tkinter import ttk, scrolledtext
from Crypto.Cipher import AES
import PySimpleGUI as sg

def get_appdata_path():
    """Gets the path to AppData\Roaming or AppData\Local."""
    operating_sys = platform.system()
    print(f"   [DEBUG] Operating system: {operating_sys}")
    if operating_sys == "Windows":
        return os.getenv('APPDATA')
    elif operating_sys == "Darwin":
        return os.path.join(os.path.expanduser('~'), 'Library', 'Application Support')
    elif operating_sys == "Linux":
        return os.path.join(os.path.expanduser('~'), '.config')
    else:
        raise OSError(f"Unsupported operating system: {operating_sys}")

def get_master_key(signal_path):
    """Retrieve and decrypt the master key from Signal's Local State file."""
    print("-> Finding and decrypting master key...")
    print(f"   [DEBUG] Signal path: {signal_path}")
    
    try:
        local_state_path = os.path.join(signal_path, 'Signal', 'Local State')
        print(f"   [DEBUG] Looking for Local State file at: {local_state_path}")
        
        if not os.path.exists(local_state_path):
            print(f"   [ERROR] Local State file not found at: {local_state_path}")
            return None
            
        with open(local_state_path, 'r', encoding='utf-8') as f:
            local_state = json.load(f)
            
        if 'os_crypt' not in local_state or 'encrypted_key' not in local_state['os_crypt']:
            print("   [ERROR] 'os_crypt' or 'encrypted_key' not found in Local State")
            print(f"   [DEBUG] Local State keys: {list(local_state.keys())}")
            if 'os_crypt' in local_state:
                print(f"   [DEBUG] os_crypt keys: {list(local_state['os_crypt'].keys())}")
            return None
            
        b64_master_key = local_state['os_crypt']['encrypted_key']
        print(f"   [DEBUG] Found encrypted master key (first 10 chars): {b64_master_key[:10]}...")
        
        encrypted_master_key_bytes = base64.b64decode(b64_master_key)
        print(f"   [DEBUG] Decoded key length: {len(encrypted_master_key_bytes)} bytes")
        
        if len(encrypted_master_key_bytes) <= 5:
            print(f"   [ERROR] Decoded key is too short: {len(encrypted_master_key_bytes)} bytes")
            return None
            
        encrypted_master_key = encrypted_master_key_bytes[5:]  # Remove DPAPI prefix
        print(f"   [DEBUG] Key after removing DPAPI prefix: {len(encrypted_master_key)} bytes")
        
        try:
            master_key = win32crypt.CryptUnprotectData(encrypted_master_key, None, None, None, 0)[1]
            print("   [SUCCESS] Master key decrypted successfully")
            print(f"   [DEBUG] Master key length: {len(master_key) if master_key else 0} bytes")
            return master_key
        except Exception as crypt_error:
            print(f"   [ERROR] Failed to decrypt master key with CryptUnprotectData: {crypt_error}")
            return None
            
    except json.JSONDecodeError as je:
        print(f"   [ERROR] Failed to parse Local State JSON: {je}")
        return None
    except Exception as e:
        print(f"   [ERROR] Unexpected error in get_master_key: {e}")
        import traceback
        print(f"   [DEBUG] Traceback: {traceback.format_exc()}")
        return None

def get_wrapped_db_key(signal_path):
    """Retrieve the wrapped database key from Signal's config file."""
    print("-> Finding wrapped database key...")
    print(f"   [DEBUG] Signal path: {signal_path}")
    
    try:
        config_path = os.path.join(signal_path, 'Signal', 'config.json')
        print(f"   [DEBUG] Looking for config file at: {config_path}")
        
        if not os.path.exists(config_path):
            print(f"   [ERROR] Config file not found at: {config_path}")
            return None
            
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
            
        if 'encryptedKey' not in config:
            print("   [ERROR] 'encryptedKey' not found in config.json")
            print(f"   [DEBUG] Available keys in config: {list(config.keys())}")
            return None
            
        wrapped_key_hex = config['encryptedKey']
        print(f"   [DEBUG] Found encryptedKey (first 10 chars): {wrapped_key_hex[:10]}...")
        print(f"   [DEBUG] Key length: {len(wrapped_key_hex)} characters")
        
        try:
            wrapped_key_bytes = bytes.fromhex(wrapped_key_hex)
            print("   [SUCCESS] Successfully decoded wrapped key")
            print(f"   [DEBUG] Decoded key length: {len(wrapped_key_bytes)} bytes")
            return wrapped_key_bytes
        except ValueError as ve:
            print(f"   [ERROR] Failed to convert hex to bytes: {ve}")
            print(f"   [DEBUG] Key content: {wrapped_key_hex}")
            return None
            
    except json.JSONDecodeError as je:
        print(f"   [ERROR] Failed to parse config.json: {je}")
        return None
    except Exception as e:
        print(f"   [ERROR] Unexpected error in get_wrapped_db_key: {e}")
        import traceback
        print(f"   [DEBUG] Traceback: {traceback.format_exc()}")
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


class TextRedirector:
    """A helper class to redirect stdout to the console."""
    def __init__(self, widget=None):
        self.widget = widget
        self.console = sys.__stdout__

    def write(self, s):
        self.console.write(s)  # Always write to console
        if self.widget and self.widget.winfo_exists():
            try:
                self.widget.configure(state='normal')
                self.widget.insert(tk.END, s)
                self.widget.see(tk.END)
                self.widget.configure(state='disabled')
            except (tk.TclError, RuntimeError):
                # If widget is destroyed, just write to console
                pass

    def flush(self):
        self.console.flush()

class App(tk.Tk):
    def __init__(self):
        super().__init__()

        # --- Window Setup ---
        self.title("Signal Key Finder")
        self.geometry("500x400")
        self.resizable(False, False)
        self.sig_path = get_appdata_path()
        print(f"   [DEBUG] Signal path: {self.sig_path}")
        
        # --- Widgets ---
        ttk.Label(self, text="Signal Desktop Key Finder", font=("Helvetica", 16)).pack(pady=10)
        ttk.Label(self, text="Click 'Start' to find and decrypt your Signal database key.").pack()

        self.status_box = scrolledtext.ScrolledText(self, height=12, state='disabled', wrap=tk.WORD)
        self.status_box.pack(pady=10, padx=10, fill='x')
        
        # Create a custom font for the label
        bold_font = ("Helvetica", 10, "bold")
        ttk.Label(self, text="Final Database Key:", font=bold_font).pack(pady=(10, 0))
        
        self.key_var = tk.StringVar()
        key_entry = ttk.Entry(self, textvariable=self.key_var, state='readonly', width=70)
        key_entry.pack(pady=5, padx=10)

        button_frame = ttk.Frame(self)
        button_frame.pack(pady=10)
        
        self.start_button = ttk.Button(button_frame, text="Start", command=self.start_decryption_thread)
        self.start_button.pack(side='left', padx=5)
        
        ttk.Button(button_frame, text="Exit", command=self.destroy).pack(side='left', padx=5)

        # --- Redirect stdout ---
        sys.stdout = TextRedirector(self.status_box)

    def start_decryption_thread(self):
        """Starts the decryption in a separate thread to keep the GUI from freezing."""
        self.start_button.config(state='disabled')
        self.status_box.configure(state='normal')
        self.status_box.delete('1.0', tk.END)
        self.status_box.configure(state='disabled')
        self.key_var.set("") # Clear previous key

        # Run the main logic in a new thread
        thread = threading.Thread(target=self.run_decryption_logic, daemon=True)
        thread.start()

    def run_decryption_logic(self):
        """The main decryption process."""
        print("========================================")
        print("Starting Decryption Process...")
        
        master_key = get_master_key(self.sig_path)
        if master_key:
            wrapped_key = get_wrapped_db_key(self.sig_path)
            if wrapped_key:
                final_key = decrypt_db_key(master_key, wrapped_key)
                if final_key:
                    self.key_var.set(final_key) # Update the GUI with the key
                    print("✅ SUCCESS! Your final key is displayed below.")
        
        print("\n========================================")
        print("Process finished.")
        self.start_button.config(state='normal') # Re-enable button

def main():
    """Main function to create and run the tkinter application."""
    app = App()
    app.mainloop()


# --- Main execution block ---
if __name__ == "__main__":

    main()