import pandas as pd
from typing import Dict, Any, List
from datetime import datetime
from pysqlcipher3 import dbapi2 as sqlite3

class SignalAnalytics:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        
    def get_message_counts(self) -> Dict[str, Any]:
        """
        Get message counts by day and hour
        Returns:
            dict: {
                "by_day": dict of date: message_count,
                "by_hour": dict of hour: message_count
            }
        """
        # Convert timestamp to datetime if it's not already
        if pd.api.types.is_numeric_dtype(self.data['timestamp']):
            self.data['timestamp'] = pd.to_datetime(self.data['timestamp'], unit='ms')
        
        # Group by day
        by_day = self.data.groupby(self.data['timestamp'].dt.date).size()
        
        # Group by hour of day
        by_hour = self.data.groupby(self.data['timestamp'].dt.hour).size()
        
        return {
            "by_day": by_day.to_dict(),
            "by_hour": by_hour.to_dict()
        }
    
    def get_top_contacts(self, n: int = 10) -> Dict[str, Any]:
        """
        Get top N contacts by message volume
        Returns:
            dict: {
                "top_contacts": list of (contact, message_count) tuples
                "total_contacts": int
            }
        """
        contact_counts = self.data['contact'].value_counts()
        return {
            "top_contacts": list(contact_counts[:n].items()),
            "total_contacts": len(contact_counts)
        }
    
    def get_message_distribution(self) -> Dict[str, Any]:
        """
        Get distribution of message types
        Returns:
            dict: {
                "message_types": dict of type: count,
                "total_messages": int
            }
        """
        if 'type' not in self.data.columns:
            return {"error": "Message type column not found"}
            
        type_counts = self.data['type'].value_counts()
        return {
            "message_types": type_counts.to_dict(),
            "total_messages": len(self.data)
        }
    
    def get_active_hours(self) -> Dict[str, Any]:
        """
        Get user's most active hours
        Returns:
            dict: {
                "hour_distribution": dict of hour: count,
                "peak_hours": list of peak hours
            }
        """
        if pd.api.types.is_numeric_dtype(self.data['timestamp']):
            self.data['timestamp'] = pd.to_datetime(self.data['timestamp'], unit='ms')
        
        hour_counts = self.data.groupby(self.data['timestamp'].dt.hour).size()
        peak_hours = hour_counts[hour_counts == hour_counts.max()].index.tolist()
        
        return {
            "hour_distribution": hour_counts.to_dict(),
            "peak_hours": peak_hours
        }
