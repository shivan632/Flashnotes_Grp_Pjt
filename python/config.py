# python/config.py
import os
import streamlit as st

class Config:
    # Get Supabase credentials - Priority: Streamlit Secrets > .env file
    SUPABASE_URL = None
    SUPABASE_SERVICE_KEY = None
    
    # Try to get from Streamlit secrets (for production on Streamlit Cloud)
    try:
        if hasattr(st, 'secrets') and "SUPABASE_URL" in st.secrets:
            SUPABASE_URL = st.secrets["SUPABASE_URL"]
            SUPABASE_SERVICE_KEY = st.secrets["SUPABASE_SERVICE_KEY"]
            print("✅ Using credentials from Streamlit secrets")
    except Exception:
        pass
    
    # Fallback to .env file (for local development)
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        try:
            from dotenv import load_dotenv
            load_dotenv()
            SUPABASE_URL = os.getenv("SUPABASE_URL")
            SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
            if SUPABASE_URL and SUPABASE_SERVICE_KEY:
                print("✅ Using credentials from .env file")
        except Exception:
            pass
    
    # Validate credentials are present
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("❌ ERROR: Supabase credentials not found!")
        print("   For local: Add SUPABASE_URL and SUPABASE_SERVICE_KEY to .env file")
        print("   For Streamlit Cloud: Add them in Settings → Secrets")
    
    # App Settings
    APP_TITLE = "FlashNotes Analytics Dashboard"
    APP_ICON = "📊"
    APP_LAYOUT = "wide"
    
    # Data Settings
    CACHE_TTL = 300  # Cache timeout in seconds
    
    # Color Theme
    COLORS = {
        'primary': '#6366F1',      # Indigo
        'secondary': '#EC4899',    # Pink
        'success': '#10B981',      # Green
        'danger': '#EF4444',       # Red
        'warning': '#F59E0B',      # Amber
        'info': '#06B6D4',         # Cyan
        'dark': '#1F2937',         # Dark Gray
        'light': '#F3F4F6'         # Light Gray
    }
    
    # Your Actual Table Names
    TABLES = {
        'users': 'users',
        'voice_notes': 'voice_notes',
        'saved_notes': 'saved_notes',
        'generated_notes': 'generated_notes',
        'quiz_attempts': 'quiz_attempts',
        'quiz_questions': 'quiz_questions',
        'feedback': 'feedback',
        'search_history': 'search_history',
        'notifications': 'notifications',
        'user_scores': 'user_scores',
        'roadmaps': 'roadmaps',
        'saved_roadmaps': 'saved_roadmaps'
    }
    
    # Table Display Names (for UI)
    TABLE_DISPLAY_NAMES = {
        'users': '👥 Users',
        'voice_notes': '🎤 Voice Notes',
        'saved_notes': '📝 Saved Notes',
        'generated_notes': '🤖 AI Generated Notes',
        'quiz_attempts': '🎯 Quiz Attempts',
        'quiz_questions': '📋 Quiz Questions',
        'feedback': '💬 User Feedback',
        'search_history': '🔍 Search History',
        'notifications': '🔔 Notifications',
        'user_scores': '🏆 User Scores',
        'roadmaps': '🗺️ Roadmaps',
        'saved_roadmaps': '⭐ Saved Roadmaps'
    }