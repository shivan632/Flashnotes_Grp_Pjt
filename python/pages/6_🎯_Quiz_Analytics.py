# python/pages/6_🎯_Quiz_Analytics.py
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from utils.supabase_client import supabase_client
from config import Config

st.set_page_config(page_title="Quiz Analytics", page_icon="🎯", layout="wide")

st.markdown("# 🎯 Quiz Analytics")
st.markdown("Quiz attempt and performance analysis")

with st.spinner("Loading quiz data..."):
    quiz_attempts = supabase_client.fetch_table('quiz_attempts', order_by=('created_at', 'desc'))
    quiz_questions = supabase_client.fetch_table('quiz_questions')

if quiz_attempts.empty:
    st.info("No quiz attempts recorded yet.")
    st.stop()

quiz_attempts['created_at'] = pd.to_datetime(quiz_attempts['created_at'])

col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric("Total Attempts", len(quiz_attempts))
with col2:
    st.metric("Unique Users", quiz_attempts['user_id'].nunique() if 'user_id' in quiz_attempts.columns else 0)
with col3:
    if 'percentage' in quiz_attempts.columns:
        st.metric("Average Score", f"{quiz_attempts['percentage'].mean():.1f}%")
with col4:
    if 'percentage' in quiz_attempts.columns:
        pass_rate = (quiz_attempts['percentage'] >= 60).mean() * 100
        st.metric("Pass Rate", f"{pass_rate:.1f}%")
with col5:
    if 'time_taken_seconds' in quiz_attempts.columns:
        avg_time = quiz_attempts['time_taken_seconds'].mean()
        st.metric("Avg Time", f"{avg_time:.0f} sec")

st.markdown("---")

col1, col2 = st.columns(2)

with col1:
    st.markdown("### 📊 Score Distribution")
    if 'score' in quiz_attempts.columns:
        fig = px.histogram(quiz_attempts, x='score', nbins=20,
                          template='plotly_dark', title=None,
                          color_discrete_sequence=[Config.COLORS['primary']])
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

with col2:
    st.markdown("### 📈 Performance Trend")
    quiz_attempts['date'] = quiz_attempts['created_at'].dt.date
    daily_avg = quiz_attempts.groupby('date')['percentage'].mean().reset_index() if 'percentage' in quiz_attempts.columns else pd.DataFrame()
    
    if not daily_avg.empty:
        daily_avg.columns = ['Date', 'Average Score']
        fig = px.line(daily_avg, x='Date', y='Average Score', template='plotly_dark',
                      markers=True, color_discrete_sequence=[Config.COLORS['secondary']])
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
