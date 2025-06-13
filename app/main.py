from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import pandas as pd
import os
from dotenv import load_dotenv
from .analytics import SignalAnalytics

load_dotenv()

app = FastAPI(title="Signal Chat Analytics API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-signal-data")
async def upload_signal_data(file: UploadFile = File(...)):
    """
    Endpoint to upload Signal chat data (either SQLite or CSV)
    """
    try:
        # Process file in memory without saving to disk
        if file.filename.endswith('.csv'):
            # Read CSV directly from file
            df = pd.read_csv(file.file)
            return {"message": "CSV file uploaded successfully", "columns": list(df.columns)}
        else:
            raise HTTPException(status_code=400, detail="Only CSV files are supported")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-analytics")
async def generate_analytics(file: UploadFile = File(...)):
    """
    Generate analytics from uploaded Signal data
    """
    try:
        # Process file in memory
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file.file)
            analytics = SignalAnalytics(df)
            
            # Get all analytics metrics
            return {
                "message_counts": analytics.get_message_counts(),
                "top_contacts": analytics.get_top_contacts(),
                "message_distribution": analytics.get_message_distribution(),
                "active_hours": analytics.get_active_hours()
            }
        else:
            raise HTTPException(status_code=400, detail="Only CSV files are supported")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
