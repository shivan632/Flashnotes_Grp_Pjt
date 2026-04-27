# python/pages/3_📝_Saved_Notes_Analytics.py
import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
from utils.supabase_client import supabase_client
from config import Config

st.set_page_config(page_title="Saved Notes Analytics", page_icon="📝", layout="wide")

st.markdown("# 📝 Saved Notes Analytics")
st.markdown("Analysis of user-saved notes and Q&A pairs")

with st.spinner("Loading saved notes data..."):
    saved_notes = supabase_client.fetch_table('saved_notes', order_by=('created_at', 'desc'))

if saved_notes.empty:
    st.info("No saved notes available yet.")
    st.stop()

saved_notes['created_at'] = pd.to_datetime(saved_notes['created_at'])
saved_notes['date'] = saved_notes['created_at'].dt.date

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Total Saved Notes", len(saved_notes))
with col2:
    st.metric("Unique Topics", saved_notes['topic'].nunique() if 'topic' in saved_notes.columns else 0)
with col3:
    st.metric("Active Users", saved_notes['user_id'].nunique() if 'user_id' in saved_notes.columns else 0)
with col4:
    days_active = (saved_notes['created_at'].max() - saved_notes['created_at'].min()).days
    st.metric("Days of Activity", days_active)

st.markdown("---")

# Top topics
col1, col2 = st.columns(2)

with col1:
    st.markdown("### 🏆 Most Saved Topics")
    topic_counts = saved_notes['topic'].value_counts().head(10).reset_index()
    topic_counts.columns = ['Topic', 'Count']
    
    fig = px.bar(topic_counts, x='Count', y='Topic', orientation='h',
                 template='plotly_dark', color_discrete_sequence=[Config.COLORS['primary']])
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.markdown("### 📈 Saved Notes Trend")
    daily_counts = saved_notes.groupby('date').size().reset_index()
    daily_counts.columns = ['Date', 'Count']
    
    fig = px.line(daily_counts, x='Date', y='Count', template='plotly_dark',
                  markers=True, color_discrete_sequence=[Config.COLORS['secondary']])
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

# Recent saves
st.markdown("### 📋 Recent Saved Notes")
display_df = saved_notes.head(50)[['topic', 'question', 'created_at', 'user_id']].copy()
display_df['created_at'] = display_df['created_at'].dt.strftime('%Y-%m-%d %H:%M')
display_df.columns = ['Topic', 'Question', 'Saved At', 'User ID']
st.dataframe(display_df, use_container_width=True, height=400)