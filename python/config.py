# python/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
    
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