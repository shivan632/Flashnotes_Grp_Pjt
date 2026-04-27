# pages/9_📈_Trends_Dashboard.py
import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
from utils.supabase_client import supabase_client
from config import Config

st.set_page_config(page_title="Trends Dashboard", page_icon="📈", layout="wide")

st.markdown("# 📈 Platform Trends Dashboard")
st.markdown("Overall platform growth and engagement trends")

with st.spinner("Loading data for trends..."):
    users = supabase_client.fetch_table('users')
    voice_notes = supabase_client.fetch_table('voice_notes')
    saved_notes = supabase_client.fetch_table('saved_notes')
    quiz_attempts = supabase_client.fetch_table('quiz_attempts')

# Process dates (remove timezone for safe comparison)
if not users.empty:
    users['created_at'] = pd.to_datetime(users['created_at'])
    if users['created_at'].dt.tz is not None:
        users['created_at'] = users['created_at'].dt.tz_localize(None)
    users['month'] = users['created_at'].dt.strftime('%Y-%m')
    users_by_month = users.groupby('month').size().reset_index()
    users_by_month.columns = ['Month', 'New Users']

if not voice_notes.empty:
    voice_notes['created_at'] = pd.to_datetime(voice_notes['created_at'])
    if voice_notes['created_at'].dt.tz is not None:
        voice_notes['created_at'] = voice_notes['created_at'].dt.tz_localize(None)
    voice_notes['month'] = voice_notes['created_at'].dt.strftime('%Y-%m')
    voice_by_month = voice_notes.groupby('month').size().reset_index()
    voice_by_month.columns = ['Month', 'Voice Notes']

if not saved_notes.empty:
    saved_notes['created_at'] = pd.to_datetime(saved_notes['created_at'])
    if saved_notes['created_at'].dt.tz is not None:
        saved_notes['created_at'] = saved_notes['created_at'].dt.tz_localize(None)
    saved_notes['month'] = saved_notes['created_at'].dt.strftime('%Y-%m')
    saved_by_month = saved_notes.groupby('month').size().reset_index()
    saved_by_month.columns = ['Month', 'Saved Notes']

# Merge trends
trends = pd.DataFrame()
if not users.empty:
    trends = users_by_month.copy()
if not voice_notes.empty and not trends.empty:
    trends = trends.merge(voice_by_month, on='Month', how='outer')
elif not voice_notes.empty:
    trends = voice_by_month.copy()
if not saved_notes.empty and not trends.empty:
    trends = trends.merge(saved_by_month, on='Month', how='outer')
elif not saved_notes.empty:
    trends = saved_by_month.copy()

if not trends.empty:
    trends = trends.fillna(0)
    
    st.markdown("### 📊 Platform Growth Over Time")
    
    fig = px.line(trends, x='Month', y=trends.columns[1:], template='plotly_dark',
                  markers=True, title=None)
    fig.update_layout(height=500)
    st.plotly_chart(fig, use_container_width=True)
else:
    st.info("Not enough data for trend analysis yet.")

# Quick stats cards
st.markdown("---")
st.markdown("### 📅 30-Day Summary")

col1, col2, col3, col4 = st.columns(4)

# Get current date without timezone
cutoff = datetime.now() - timedelta(days=30)

with col1:
    if not users.empty:
        new_users = len(users[users['created_at'] >= cutoff])
        st.metric("New Users (30d)", new_users)

with col2:
    if not voice_notes.empty:
        new_voice = len(voice_notes[voice_notes['created_at'] >= cutoff])
        st.metric("New Voice Notes (30d)", new_voice)

with col3:
    if not saved_notes.empty:
        new_saved = len(saved_notes[saved_notes['created_at'] >= cutoff])
        st.metric("New Saved Notes (30d)", new_saved)

with col4:
    if not quiz_attempts.empty:
        quiz_attempts['created_at'] = pd.to_datetime(quiz_attempts['created_at'])
        if quiz_attempts['created_at'].dt.tz is not None:
            quiz_attempts['created_at'] = quiz_attempts['created_at'].dt.tz_localize(None)
        new_quiz = len(quiz_attempts[quiz_attempts['created_at'] >= cutoff])
        st.metric("Quiz Attempts (30d)", new_quiz)

# Monthly growth table
st.markdown("---")
st.markdown("### 📊 Monthly Growth Data")

if not trends.empty:
    st.dataframe(trends, use_container_width=True, hide_index=True)
else:
    st.info("No monthly data available yet.")