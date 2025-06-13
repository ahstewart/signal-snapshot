# Signal Chat Analytics Dashboard

A web application that analyzes Signal chat data and provides a comprehensive dashboard for users to explore their messaging patterns.

## Features

- Upload Signal chat data (SQLite database or CSV backup)
- Generate detailed analytics about your messaging patterns
- Visualize message volume by time
- Identify top contacts and conversation patterns
- Share your analytics dashboard with others

## Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`

## Data Import

The application supports two types of data input:

1. **Signal Desktop SQLite Database**
   - Located at `%APPDATA%\Signal\data.sqlite` on Windows
   - Requires SQLCipher encryption key

2. **Signal Android CSV Backup**
   - Created through Signal Android's backup feature
   - Converted to CSV format

## Security Note

This application does not store any user data. All processing is done locally on the user's device. Signal's end-to-end encryption remains intact as we only analyze data that has been exported by the user.
