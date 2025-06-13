# Development Environment Setup

## Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`

## Frontend Setup

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Start the frontend development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Note about PowerShell Execution Policy

If you encounter PowerShell execution policy errors, you can:
1. Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy RemoteSigned
```

2. Or manually execute each command in sequence

## Project Structure

```
signal-analytics/
├── app/                   # Backend code
│   ├── main.py           # FastAPI application
│   └── analytics.py      # Analytics processing
├── frontend/             # React frontend
│   ├── package.json      # Frontend dependencies
│   └── src/              # Frontend source code
├── requirements.txt      # Backend dependencies
└── README.md            # Project documentation
```
