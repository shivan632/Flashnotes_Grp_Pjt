# python/pages/2_🎤_Voice_Notes_Analytics.py
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
from utils.supabase_client import supabase_client
from config import Config

st.set_page_config(page_title="Voice Notes Analytics", page_icon="🎤", layout="wide")

st.markdown("# 🎤 Voice Notes Analytics")
st.markdown("Comprehensive analysis of all voice recordings")

# Load data
with st.spinner("Loading voice notes data..."):
    voice_notes = supabase_client.fetch_table('voice_notes', order_by=('created_at', 'desc'))

if voice_notes.empty:
    st.info("No voice notes data available yet. Start recording to see analytics!")
    st.stop()

# Process data
voice_notes['created_at'] = pd.to_datetime(voice_notes['created_at'])
voice_notes['date'] = voice_notes['created_at'].dt.date
voice_notes['hour'] = voice_notes['created_at'].dt.hour
voice_notes['day_of_week'] = voice_notes['created_at'].dt.day_name()
voice_notes['month'] = voice_notes['created_at'].dt.strftime('%Y-%m')

# Sidebar filters
st.sidebar.markdown("## 🔍 Filters")
date_range = st.sidebar.selectbox(
    "Date Range",
    ["Last 7 days", "Last 30 days", "Last 90 days", "All time"],
    index=3
)

if date_range != "All time":
    days = int(date_range.split()[1])
    cutoff = datetime.now() - timedelta(days=days)
    voice_notes = voice_notes[voice_notes['created_at'] >= cutoff]

# Summary metrics
col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric("Total Notes", len(voice_notes), help="Total voice recordings")
with col2:
    if 'word_count' in voice_notes.columns:
        st.metric("Total Words", f"{voice_notes['word_count'].sum():,}")
with col3:
    if 'char_count' in voice_notes.columns:
        st.metric("Total Characters", f"{voice_notes['char_count'].sum():,}")
with col4:
    if 'is_favorite' in voice_notes.columns:
        fav_pct = (voice_notes['is_favorite'].sum() / len(voice_notes)) * 100
        st.metric("Favorite Rate", f"{fav_pct:.1f}%")
with col5:
    if 'user_id' in voice_notes.columns:
        st.metric("Active Users", voice_notes['user_id'].nunique())

st.markdown("---")

# Charts Row 1
col1, col2 = st.columns(2)

with col1:
    st.markdown("### 📈 Daily Voice Notes Trend")
    daily_counts = voice_notes.groupby('date').size().reset_index()
    daily_counts.columns = ['Date', 'Count']
    
    fig = px.line(daily_counts, x='Date', y='Count', title=None,
                  template='plotly_dark', markers=True,
                  color_discrete_sequence=[Config.COLORS['primary']])
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.markdown("### ⏰ Notes by Hour of Day")
    hourly_counts = voice_notes.groupby('hour').size().reset_index()
    hourly_counts.columns = ['Hour', 'Count']
    
    fig = px.bar(hourly_counts, x='Hour', y='Count', title=None,
                 template='plotly_dark', color_discrete_sequence=[Config.COLORS['secondary']])
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

# Charts Row 2
col1, col2 = st.columns(2)

with col1:
    st.markdown("### 📅 Weekly Pattern")
    dow_counts = voice_notes.groupby('day_of_week').size().reset_index()
    dow_counts.columns = ['Day', 'Count']
    day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    dow_counts['Day'] = pd.Categorical(dow_counts['Day'], categories=day_order, ordered=True)
    dow_counts = dow_counts.sort_values('Day')
    
    fig = px.bar(dow_counts, x='Day', y='Count', title=None,
                 template='plotly_dark', color_discrete_sequence=[Config.COLORS['info']])
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.markdown("### 📊 Word Count Distribution")
    if 'word_count' in voice_notes.columns:
        fig = px.histogram(voice_notes, x='word_count', nbins=30, title=None,
                          template='plotly_dark', color_discrete_sequence=[Config.COLORS['primary']])
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

st.markdown("---")

# Monthly trend
st.markdown("### 📆 Monthly Voice Notes Trend")
monthly_counts = voice_notes.groupby('month').size().reset_index()
monthly_counts.columns = ['Month', 'Count']

fig = px.bar(monthly_counts, x='Month', y='Count', title=None,
             template='plotly_dark', color_discrete_sequence=[Config.COLORS['secondary']])
st.plotly_chart(fig, use_container_width=True)

# Recent notes table
st.markdown("### 📋 Recent Voice Notes")
display_df = voice_notes.head(50)[['text', 'created_at', 'word_count', 'char_count', 'is_favorite']].copy()
display_df['created_at'] = display_df['created_at'].dt.strftime('%Y-%m-%d %H:%M')
display_df['is_favorite'] = display_df['is_favorite'].map({True: '⭐', False: '☆'})
display_df.columns = ['Content', 'Created At', 'Words', 'Characters', '⭐']

st.dataframe(display_df, use_container_width=True, height=400)

# Export
if st.button("📥 Export All Voice Notes to CSV"):
    csv = voice_notes.to_csv(index=False)
    st.download_button(
        label="Download CSV",
        data=csv,
        file_name=f"voice_notes_{datetime.now().strftime('%Y%m%d')}.csv",
        mime="text/csv"
    )
