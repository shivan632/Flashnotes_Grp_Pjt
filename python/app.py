# python/app.py
import streamlit as st
import pandas as pd
from config import Config
from utils.supabase_client import supabase_client
from datetime import datetime

st.set_page_config(
    page_title=Config.APP_TITLE,
    page_icon=Config.APP_ICON,
    layout=Config.APP_LAYOUT,
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .stApp {
        background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    }
    .main-header {
        background: linear-gradient(90deg, #6366F1, #EC4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.5rem;
        font-weight: bold;
        text-align: center;
    }
    .sub-header {
        color: #94A3B8;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #1F2937, #111827);
        border-radius: 1rem;
        padding: 1rem;
        border: 1px solid #374151;
        text-align: center;
    }
    .metric-value {
        font-size: 2rem;
        font-weight: bold;
        color: #6366F1;
    }
    .metric-label {
        color: #9CA3AF;
        font-size: 0.875rem;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.markdown("## 🚀 FlashNotes")
    st.markdown("### Analytics Dashboard v1.0")
    st.markdown("---")
    
    st.markdown("### 📊 Available Reports")
    reports = {
        "🏠 Overview": "Overview",
        "🎤 Voice Notes": "Voice_Notes_Analytics",
        "📝 Saved Notes": "Saved_Notes_Analytics",
        "🤖 AI Notes": "AI_Notes_Analytics",
        "👥 Users": "Users_Analytics",
        "🎯 Quiz": "Quiz_Analytics",
        "💬 Feedback": "Feedback_Analytics",
        "🗺️ Roadmaps": "Roadmap_Analytics",
        "📈 Trends": "Trends_Dashboard"
    }
    
    for display, page in reports.items():
        if st.button(display, use_container_width=True, key=page):
            st.switch_page(f"pages/{page}.py")
    
    st.markdown("---")
    st.caption(f"Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# Main content
st.markdown('<div class="main-header">FlashNotes Analytics Dashboard</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Real-time insights from your learning platform</div>', unsafe_allow_html=True)

# Load summary data
with st.spinner("Loading dashboard data..."):
    user_analytics = supabase_client.get_user_analytics()
    voice_analytics = supabase_client.get_voice_notes_analytics()
    quiz_analytics = supabase_client.get_quiz_analytics()
    roadmap_analytics = supabase_client.get_roadmap_analytics()

# Key metrics row
st.markdown("### 📊 Platform Overview")
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{user_analytics.get('total_users', 0):,}</div>
        <div class="metric-label">Total Users</div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{voice_analytics.get('total_notes', 0):,}</div>
        <div class="metric-label">Voice Notes</div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{quiz_analytics.get('total_attempts', 0):,}</div>
        <div class="metric-label">Quiz Attempts</div>
    </div>
    """, unsafe_allow_html=True)

with col4:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{roadmap_analytics.get('total_roadmaps', 0):,}</div>
        <div class="metric-label">Roadmaps Created</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")
st.info("👈 Use the sidebar to navigate to detailed analytics pages for each module!")

# Quick stats table
st.markdown("### 📋 Quick Statistics")

# Fetch additional counts safely
try:
    saved_notes_df = supabase_client.fetch_table('saved_notes')
    saved_notes_count = len(saved_notes_df) if not saved_notes_df.empty else 0
except:
    saved_notes_count = 0

try:
    generated_notes_df = supabase_client.fetch_table('generated_notes')
    generated_notes_count = len(generated_notes_df) if not generated_notes_df.empty else 0
except:
    generated_notes_count = 0

try:
    feedback_df = supabase_client.fetch_table('feedback')
    feedback_count = len(feedback_df) if not feedback_df.empty else 0
except:
    feedback_count = 0

stats_data = {
    "Module": ["Users", "Voice Notes", "Saved Notes", "AI Notes", "Quiz", "Feedback", "Roadmaps"],
    "Total": [
        user_analytics.get('total_users', 0),
        voice_analytics.get('total_notes', 0),
        saved_notes_count,
        generated_notes_count,
        quiz_analytics.get('total_attempts', 0),
        feedback_count,
        roadmap_analytics.get('total_roadmaps', 0)
    ]
}

stats_df = pd.DataFrame(stats_data)
st.dataframe(stats_df, use_container_width=True, hide_index=True)