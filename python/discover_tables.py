# python/discover_tables.py
import os
import pandas as pd
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)

def discover_all_tables():
    """Discover all tables in the public schema"""
    
    # Query to get all table names
    query = """
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """
    
    try:
        # Try to execute raw SQL
        result = supabase.rpc('exec_sql', {'query': query}).execute()
        tables = [row['table_name'] for row in result.data]
        return tables
    except:
        # Alternative: List known tables based on your project structure
        known_tables = [
            'users',
            'voice_notes',
            'saved_notes', 
            'generated_notes',
            'quiz_attempts',
            'quiz_questions',
            'feedback',
            'search_history',
            'notifications',
            'user_scores',
            'roadmaps',
            'saved_roadmaps'
        ]
        return known_tables

def get_table_schema(table_name):
    """Get schema information for a table"""
    try:
        query = f"""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = '{table_name}'
            ORDER BY ordinal_position;
        """
        result = supabase.rpc('exec_sql', {'query': query}).execute()
        return pd.DataFrame(result.data)
    except:
        return pd.DataFrame()

if __name__ == "__main__":
    print("🔍 Discovering tables in Supabase...\n")
    
    tables = discover_all_tables()
    
    print("📋 Tables found in your database:")
    print("-" * 40)
    for i, table in enumerate(tables, 1):
        print(f"{i:2}. {table}")
    
    print("\n" + "=" * 40)
    
    # Get schema for each table
    for table in tables:
        print(f"\n📊 Schema for '{table}':")
        schema = get_table_schema(table)
        if not schema.empty:
            print(schema.to_string(index=False))
        else:
            print("   Could not fetch schema")
        print("-" * 40)