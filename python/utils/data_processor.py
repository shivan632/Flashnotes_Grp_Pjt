# utils/data_processor.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class DataProcessor:
    @staticmethod
    def process_voice_notes(df):
        """Process and enrich voice notes data"""
        if df.empty:
            return df
        
        # Make a copy to avoid warnings
        df = df.copy()
        
        # Convert timestamps
        if 'created_at' in df.columns:
            df['created_at'] = pd.to_datetime(df['created_at'])
            df['date'] = df['created_at'].dt.date
            df['hour'] = df['created_at'].dt.hour
            df['day_of_week'] = df['created_at'].dt.day_name()
            df['month'] = df['created_at'].dt.month_name()
            df['week'] = df['created_at'].dt.isocalendar().week
        
        # Add text length categories
        if 'char_count' in df.columns:
            df['length_category'] = pd.cut(
                df['char_count'],
                bins=[0, 100, 500, 1000, 5000, float('inf')],
                labels=['Tiny', 'Short', 'Medium', 'Long', 'Very Long']
            )
        
        # Add word count categories
        if 'word_count' in df.columns:
            df['word_category'] = pd.cut(
                df['word_count'],
                bins=[0, 20, 50, 100, 200, float('inf')],
                labels=['Very Short', 'Short', 'Medium', 'Long', 'Very Long']
            )
        
        return df
    
    @staticmethod
    def process_time_series(df, date_column='created_at', value_column='id', frequency='D'):
        """Create time series aggregation"""
        if df.empty or date_column not in df.columns:
            return pd.DataFrame()
        
        df = df.copy()
        df[date_column] = pd.to_datetime(df[date_column])
        df.set_index(date_column, inplace=True)
        
        # Resample based on frequency
        if frequency == 'D':
            series = df.resample('D').size()
        elif frequency == 'W':
            series = df.resample('W').size()
        elif frequency == 'M':
            series = df.resample('M').size()
        elif frequency == 'H':
            series = df.resample('H').size()
        else:
            series = df.resample('D').size()
        
        return series.reset_index().rename(columns={df.index.name: 'date', 0: 'count'})
    
    @staticmethod
    def calculate_growth_rate(series):
        """Calculate month-over-month or week-over-week growth"""
        if len(series) < 2:
            return 0
        
        previous = series.iloc[-2] if len(series) >= 2 else 0
        current = series.iloc[-1]
        
        if previous == 0:
            return 100 if current > 0 else 0
        
        return ((current - previous) / previous) * 100
    
    @staticmethod
    def get_top_users(df, column='user_id', count=10):
        """Get top users by activity"""
        if df.empty or column not in df.columns:
            return pd.DataFrame()
        
        top_users = df.groupby(column).size().reset_index(name='activity_count')
        top_users = top_users.nlargest(count, 'activity_count')
        return top_users

data_processor = DataProcessor()