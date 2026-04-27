# python/view_schema.py
import pandas as pd
from utils.supabase_client import supabase_client
from config import Config

def view_all_schemas():
    """View schema information for all tables"""
    
    print("\n" + "="*60)
    print("📊 FLASHNOTES DATABASE SCHEMA")
    print("="*60)
    
    for key, table_name in Config.TABLES.items():
        print(f"\n📁 Table: {key} → {table_name}")
        print("-" * 40)
        
        # Get sample data to infer schema
        df = supabase_client.fetch_table(table_name, limit=5)
        
        if not df.empty:
            print(f"   ✅ Total rows available")
            print(f"   📋 Columns:")
            for col in df.columns:
                dtype = df[col].dtype
                sample = str(df[col].iloc[0])[:50] if len(df) > 0 else "N/A"
                print(f"      • {col} ({dtype})")
                print(f"        Sample: {sample}")
        else:
            print(f"   ⚠️ No data available")
        
        print()

if __name__ == "__main__":
    view_all_schemas()