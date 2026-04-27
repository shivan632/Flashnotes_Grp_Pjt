# test_connection.py
from utils.supabase_client import supabase_client
import streamlit as st

# Test fetch
df = supabase_client.fetch_table('users', limit=5)
print(f"✅ Fetched {len(df)} users")
print(df.head())