# pages/1_📊_Dashboard.py
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
from utils.supabase_client import supabase_client
from config import Config

st.set_page_config(page_title="Dashboard", page_icon="📊", layout="wide")

st.markdown("# 📊 Analytics Dashboard")
st.markdown("Comprehensive overview of your FlashNotes platform")

# Load all data with error handling
@st.cache_data(ttl=300)
def load_all_data():
    """Load all necessary data for dashboard"""
    data = {}
    
    # Fetch voice notes
    voice_notes = supabase_client.fetch_table('voice_notes')
    if not voice_notes.empty:
        voice_notes['created_at'] = pd.to_datetime(voice_notes['created_at'])
        voice_notes['date'] = voice_notes['created_at'].dt.date
        voice_notes['hour'] = voice_notes['created_at'].dt.hour
        voice_notes['day_of_week'] = voice_notes['created_at'].dt.day_name()
    data['voice_notes'] = voice_notes
    
    # Fetch users
    users = supabase_client.fetch_table('users')
    if not users.empty and 'created_at' in users.columns:
        users['created_at'] = pd.to_datetime(users['created_at'])
    data['users'] = users
    
    # Fetch saved notes
    saved_notes = supabase_client.fetch_table('saved_notes')
    if not saved_notes.empty and 'created_at' in saved_notes.columns:
        saved_notes['created_at'] = pd.to_datetime(saved_notes['created_at'])
    data['saved_notes'] = saved_notes
    
    # Fetch generated notes
    generated_notes = supabase_client.fetch_table('generated_notes')
    if not generated_notes.empty and 'generated_at' in generated_notes.columns:
        generated_notes['generated_at'] = pd.to_datetime(generated_notes['generated_at'])
    data['generated_notes'] = generated_notes
    
    # Fetch quiz attempts
    quiz_attempts = supabase_client.fetch_table('quiz_attempts')
    if not quiz_attempts.empty and 'created_at' in quiz_attempts.columns:
        quiz_attempts['created_at'] = pd.to_datetime(quiz_attempts['created_at'])
    data['quiz_attempts'] = quiz_attempts
    
    # Fetch feedback
    feedback = supabase_client.fetch_table('feedback')
    if not feedback.empty and 'created_at' in feedback.columns:
        feedback['created_at'] = pd.to_datetime(feedback['created_at'])
    data['feedback'] = feedback
    
    # Fetch roadmaps
    roadmaps = supabase_client.fetch_table('roadmaps')
    if not roadmaps.empty and 'created_at' in roadmaps.columns:
        roadmaps['created_at'] = pd.to_datetime(roadmaps['created_at'])
    data['roadmaps'] = roadmaps
    
    return data

with st.spinner("Loading dashboard data..."):
    data = load_all_data()

voice_notes = data['voice_notes']
users = data['users']
saved_notes = data['saved_notes']
generated_notes = data['generated_notes']
quiz_attempts = data['quiz_attempts']
feedback = data['feedback']
roadmaps = data['roadmaps']

# Date range filter in sidebar
st.sidebar.markdown("## 🔍 Filters")
date_range = st.sidebar.selectbox(
    "Date Range",
    ["Last 7 days", "Last 30 days", "Last 90 days", "All time"],
    index=3
)

if date_range != "All time" and not voice_notes.empty:
    days = int(date_range.split()[1])
    cutoff = datetime.now() - timedelta(days=days)
    voice_notes_filtered = voice_notes[voice_notes['created_at'] >= cutoff]
else:
    voice_notes_filtered = voice_notes

# ============= KPI METRICS ROW =============
st.markdown("## 🎯 Key Performance Indicators")

col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric("👥 Total Users", f"{len(users):,}" if not users.empty else "0")
with col2:
    st.metric("🎤 Voice Notes", f"{len(voice_notes):,}" if not voice_notes.empty else "0")
with col3:
    st.metric("📝 Saved Notes", f"{len(saved_notes):,}" if not saved_notes.empty else "0")
with col4:
    st.metric("🤖 AI Notes", f"{len(generated_notes):,}" if not generated_notes.empty else "0")
with col5:
    st.metric("🎯 Quiz Attempts", f"{len(quiz_attempts):,}" if not quiz_attempts.empty else "0")

st.markdown("---")

# ============= VOICE NOTES SECTION =============
if not voice_notes.empty:
    st.markdown("## 🎤 Voice Notes Analytics")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        total_words = voice_notes['word_count'].sum() if 'word_count' in voice_notes.columns else 0
        st.metric("Total Words Written", f"{total_words:,}")
    with col2:
        total_chars = voice_notes['char_count'].sum() if 'char_count' in voice_notes.columns else 0
        st.metric("Total Characters", f"{total_chars:,}")
    with col3:
        avg_words = voice_notes['word_count'].mean() if 'word_count' in voice_notes.columns else 0
        st.metric("Avg Words/Note", f"{avg_words:.0f}")
    with col4:
        favorites = voice_notes['is_favorite'].sum() if 'is_favorite' in voice_notes.columns else 0
        fav_pct = (favorites / len(voice_notes)) * 100 if len(voice_notes) > 0 else 0
        st.metric("Favorite Rate", f"{fav_pct:.1f}%")
    
    # Voice notes charts
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 📈 Daily Voice Notes Trend")
        daily_counts = voice_notes_filtered.groupby('date').size().reset_index()
        daily_counts.columns = ['Date', 'Count']
        
        fig = px.line(daily_counts, x='Date', y='Count', template='plotly_dark',
                      markers=True, color_discrete_sequence=[Config.COLORS['primary']])
        fig.update_layout(height=350, margin=dict(l=0, r=0, t=0, b=0))
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("#### ⏰ Activity by Hour")
        hourly_counts = voice_notes_filtered.groupby('hour').size().reset_index()
        hourly_counts.columns = ['Hour', 'Count']
        
        fig = px.bar(hourly_counts, x='Hour', y='Count', template='plotly_dark',
                     color_discrete_sequence=[Config.COLORS['secondary']])
        fig.update_layout(height=350, margin=dict(l=0, r=0, t=0, b=0))
        st.plotly_chart(fig, use_container_width=True)
    
    # Day of week analysis
    st.markdown("#### 📅 Activity by Day of Week")
    dow_counts = voice_notes_filtered.groupby('day_of_week').size().reset_index()
    dow_counts.columns = ['Day', 'Count']
    day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    dow_counts['Day'] = pd.Categorical(dow_counts['Day'], categories=day_order, ordered=True)
    dow_counts = dow_counts.sort_values('Day')
    
    fig = px.bar(dow_counts, x='Day', y='Count', template='plotly_dark',
                 color_discrete_sequence=[Config.COLORS['info']])
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)
    
    st.markdown("---")

# ============= USER ENGAGEMENT SECTION =============
if not users.empty:
    st.markdown("## 👥 User Engagement")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 📈 User Registrations Over Time")
        users['created_at'] = pd.to_datetime(users['created_at'])
        users['date'] = users['created_at'].dt.date
        daily_reg = users.groupby('date').size().reset_index()
        daily_reg.columns = ['Date', 'Registrations']
        
        fig = px.line(daily_reg, x='Date', y='Registrations', template='plotly_dark',
                      markers=True, color_discrete_sequence=[Config.COLORS['primary']])
        fig.update_layout(height=350)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("#### 📊 Email Verification Status")
        if 'email_verified' in users.columns:
            verified_count = users['email_verified'].sum()
            not_verified = len(users) - verified_count
            
            fig = px.pie(values=[verified_count, not_verified], 
                         names=['Verified', 'Not Verified'],
                         template='plotly_dark',
                         color_discrete_sequence=[Config.COLORS['success'], Config.COLORS['warning']])
            fig.update_layout(height=350)
            st.plotly_chart(fig, use_container_width=True)
    
    # Active users metric
    if not voice_notes.empty and 'user_id' in voice_notes.columns:
        active_users = voice_notes['user_id'].nunique()
        engagement_rate = (active_users / len(users)) * 100
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Active Users (Voice Notes)", active_users)
        with col2:
            st.metric("Engagement Rate", f"{engagement_rate:.1f}%")
        with col3:
            if 'user_id' in saved_notes.columns:
                saved_active = saved_notes['user_id'].nunique()
                st.metric("Users with Saved Notes", saved_active)
    
    st.markdown("---")

# ============= AI GENERATED NOTES SECTION =============
if not generated_notes.empty:
    st.markdown("## 🤖 AI Generated Notes Analytics")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total AI Notes", len(generated_notes))
    with col2:
        if 'is_favorite' in generated_notes.columns:
            fav_count = generated_notes['is_favorite'].sum()
            st.metric("Favorite Notes", fav_count)
    with col3:
        if 'view_count' in generated_notes.columns:
            st.metric("Total Views", generated_notes['view_count'].sum())
    with col4:
        if 'difficulty' in generated_notes.columns:
            unique_difficulties = generated_notes['difficulty'].nunique()
            st.metric("Difficulty Levels", unique_difficulties)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 📊 Difficulty Distribution")
        if 'difficulty' in generated_notes.columns:
            diff_counts = generated_notes['difficulty'].value_counts().reset_index()
            diff_counts.columns = ['Difficulty', 'Count']
            
            fig = px.pie(diff_counts, values='Count', names='Difficulty',
                         template='plotly_dark', color_discrete_sequence=px.colors.sequential.Plasma)
            fig.update_layout(height=350)
            st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("#### 🔥 Most Popular Topics")  # ✅ Fixed: changed from markfire to markdown
        if 'topic' in generated_notes.columns:
            topic_counts = generated_notes['topic'].value_counts().head(10).reset_index()
            topic_counts.columns = ['Topic', 'Count']
            
            fig = px.bar(topic_counts, x='Count', y='Topic', orientation='h',
                         template='plotly_dark', color_discrete_sequence=[Config.COLORS['secondary']])
            fig.update_layout(height=350)
            st.plotly_chart(fig, use_container_width=True)
    
    st.markdown("---")

# ============= QUIZ ANALYTICS SECTION =============
if not quiz_attempts.empty:
    st.markdown("## 🎯 Quiz Analytics")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Attempts", len(quiz_attempts))
    with col2:
        if 'user_id' in quiz_attempts.columns:
            unique_users = quiz_attempts['user_id'].nunique()
            st.metric("Unique Participants", unique_users)
    with col3:
        if 'percentage' in quiz_attempts.columns:
            avg_score = quiz_attempts['percentage'].mean()
            st.metric("Average Score", f"{avg_score:.1f}%")
    with col4:
        if 'percentage' in quiz_attempts.columns:
            pass_rate = (quiz_attempts['percentage'] >= 60).mean() * 100
            st.metric("Pass Rate", f"{pass_rate:.1f}%")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 📊 Score Distribution")
        if 'score' in quiz_attempts.columns:
            fig = px.histogram(quiz_attempts, x='score', nbins=20,
                               template='plotly_dark',
                               color_discrete_sequence=[Config.COLORS['primary']])
            fig.update_layout(height=350)
            st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("#### 📈 Performance Trend")
        quiz_attempts['date'] = quiz_attempts['created_at'].dt.date
        daily_avg = quiz_attempts.groupby('date')['percentage'].mean().reset_index() if 'percentage' in quiz_attempts.columns else pd.DataFrame()
        
        if not daily_avg.empty:
            daily_avg.columns = ['Date', 'Average Score']
            fig = px.line(daily_avg, x='Date', y='Average Score', template='plotly_dark',
                          markers=True, color_discrete_sequence=[Config.COLORS['secondary']])
            fig.update_layout(height=350)
            st.plotly_chart(fig, use_container_width=True)
    
    st.markdown("---")

# ============= FEEDBACK SECTION =============
if not feedback.empty:
    st.markdown("## 💬 User Feedback")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Total Feedback", len(feedback))
    with col2:
        if 'rating' in feedback.columns:
            avg_rating = feedback['rating'].mean()
            st.metric("Average Rating", f"{avg_rating:.1f} / 5")
    with col3:
        if 'rating' in feedback.columns:
            five_star = feedback[feedback['rating'] == 5].shape[0]
            st.metric("5-Star Reviews", five_star)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### ⭐ Rating Distribution")
        if 'rating' in feedback.columns:
            rating_counts = feedback['rating'].value_counts().sort_index().reset_index()
            rating_counts.columns = ['Rating', 'Count']
            
            fig = px.bar(rating_counts, x='Rating', y='Count', template='plotly_dark',
                         color_discrete_sequence=[Config.COLORS['warning']])
            fig.update_layout(height=350)
            st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("#### 📈 Feedback Trend")
        feedback['date'] = feedback['created_at'].dt.date
        daily_feedback = feedback.groupby('date').size().reset_index()
        daily_feedback.columns = ['Date', 'Count']
        
        fig = px.line(daily_feedback, x='Date', y='Count', template='plotly_dark',
                      markers=True, color_discrete_sequence=[Config.COLORS['info']])
        fig.update_layout(height=350)
        st.plotly_chart(fig, use_container_width=True)
    
    # Recent feedback
    with st.expander("📋 Recent User Feedback"):
        recent_feedback = feedback.nlargest(10, 'created_at')[['name', 'rating', 'feedback', 'created_at']].copy()
        recent_feedback['created_at'] = recent_feedback['created_at'].dt.strftime('%Y-%m-%d %H:%M')
        recent_feedback.columns = ['Name', 'Rating', 'Feedback', 'Date']
        st.dataframe(recent_feedback, use_container_width=True, hide_index=True)
    
    st.markdown("---")

# ============= ROADMAP SECTION =============
if not roadmaps.empty:
    st.markdown("## 🗺️ Learning Roadmaps")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Roadmaps", len(roadmaps))
    with col2:
        if 'topic' in roadmaps.columns:
            unique_topics = roadmaps['topic'].nunique()
            st.metric("Unique Topics", unique_topics)
    with col3:
        if 'view_count' in roadmaps.columns:
            st.metric("Total Views", roadmaps['view_count'].sum())
    with col4:
        if 'save_count' in roadmaps.columns:
            st.metric("Total Saves", roadmaps['save_count'].sum())
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 🔥 Most Popular Roadmap Topics")
        if 'topic' in roadmaps.columns:
            topic_counts = roadmaps['topic'].value_counts().head(10).reset_index()
            topic_counts.columns = ['Topic', 'Count']
            
            fig = px.bar(topic_counts, x='Count', y='Topic', orientation='h',
                         template='plotly_dark', color_discrete_sequence=[Config.COLORS['primary']])
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("#### 📊 Difficulty Distribution")
        if 'difficulty' in roadmaps.columns:
            diff_counts = roadmaps['difficulty'].value_counts().reset_index()
            diff_counts.columns = ['Difficulty', 'Count']
            
            fig = px.pie(diff_counts, values='Count', names='Difficulty',
                         template='plotly_dark', color_discrete_sequence=px.colors.sequential.Sunset)
            fig.update_layout(height=350)
            st.plotly_chart(fig, use_container_width=True)

# ============= SUMMARY TABLE =============
st.markdown("---")
st.markdown("## 📋 Platform Summary")

summary_data = {
    "Module": ["Users", "Voice Notes", "Saved Notes", "AI Generated Notes", "Quiz Attempts", "Feedback", "Roadmaps"],
    "Total Count": [
        len(users) if not users.empty else 0,
        len(voice_notes) if not voice_notes.empty else 0,
        len(saved_notes) if not saved_notes.empty else 0,
        len(generated_notes) if not generated_notes.empty else 0,
        len(quiz_attempts) if not quiz_attempts.empty else 0,
        len(feedback) if not feedback.empty else 0,
        len(roadmaps) if not roadmaps.empty else 0
    ]
}

summary_df = pd.DataFrame(summary_data)
st.dataframe(summary_df, use_container_width=True, hide_index=True)

# Export option
st.markdown("---")
col1, col2, col3 = st.columns([1, 2, 1])
with col2:
    if st.button("📥 Export Dashboard Data to CSV", use_container_width=True):
        # Create a comprehensive export
        export_data = {}
        
        if not voice_notes.empty:
            export_data['voice_notes'] = voice_notes
        if not users.empty:
            export_data['users'] = users
        if not saved_notes.empty:
            export_data['saved_notes'] = saved_notes
        if not generated_notes.empty:
            export_data['generated_notes'] = generated_notes
        if not quiz_attempts.empty:
            export_data['quiz_attempts'] = quiz_attempts
        if not feedback.empty:
            export_data['feedback'] = feedback
        if not roadmaps.empty:
            export_data['roadmaps'] = roadmaps
        
        # Create Excel file with multiple sheets
        from io import BytesIO
        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            for sheet_name, df in export_data.items():
                df.to_excel(writer, sheet_name=sheet_name[:31], index=False)  # Sheet name max 31 chars
        
        st.download_button(
            label="📥 Download Excel File",
            data=output.getvalue(),
            file_name=f"flashnotes_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

st.info("👈 Use the sidebar to navigate to detailed analytics pages for each module!")