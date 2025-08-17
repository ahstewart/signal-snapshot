# Signal Chat Analytics Dashboard

A privacy-focused, client-side web application that analyzes your Signal Desktop chat history directly in your browser.

## Features

- **100% Client-Side Processing**: Your data never leaves your computer
- **Secure**: All processing happens in your browser - no server-side processing
- **No Installation Required**: Just open the app in your web browser
- **Detailed Analytics**: Visualize your messaging patterns and statistics

## How to Use

1. **Prepare Your Signal Data**:
   - Locate your Signal Desktop database file (typically at `%APPDATA%\Signal\sql\db.sqlite` on Windows)
   - Decrypt the database using Signal's built-in export feature

2. **Open the App**:
   - Simply open `index.html` in your web browser or host it on a web server
   - No server setup or installation required

3. **Upload and Analyze**:
   - Click "Upload" and select your decrypted Signal SQLite database file
   - View your chat analytics immediately in your browser

## Privacy and Security

- **No Data Leaves Your Computer**: All processing happens directly in your web browser
- **No Server Required**: The app runs entirely in the browser with no backend server
- **No Tracking**: We don't use any analytics or tracking services
- **Temporary Storage**: Your data is only stored in your browser's memory and is cleared when you close the tab

## Supported Data Format

This application currently supports:
- Decrypted Signal Desktop SQLite database files (`.sqlite`)

## Technical Details

- Built with React and TypeScript
- Uses SQL.js for in-browser SQLite processing
- Responsive design works on desktop and tablet devices
