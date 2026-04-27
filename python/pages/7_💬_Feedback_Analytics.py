# python/pages/7_💬_Feedback_Analytics.py
import streamlit as st
import pandas as pd
import plotly.express as px
from utils.supabase_client import supabase_client
from config import Config

st.set_page_config(page_title="Feedback Analytics", page_icon="💬", layout="wide")

st.markdown("# 💬 User Feedback Analytics")
st.markdown("Analysis of user feedback and ratings")

with st.spinner("Loading feedback data..."):
    feedback = supabase_client.fetch_table('feedback', order_by=('created_at', 'desc'))

if feedback.empty:
    st.info("No feedback available yet.")
    st.stop()

feedback['created_at'] = pd.to_datetime(feedback['created_at'])

col1, col2, col3 = st.columns(3)

with col1:
    st.metric("Total Feedback", len(feedback))
with col2:
    st.metric("Average Rating", f"{feedback['rating'].mean():.1f} / 5" if 'rating' in feedback.columns else "N/A")
with col3:
    st.metric("5-Star Reviews", feedback[feedback['rating'] == 5].shape[0] if 'rating' in feedback.columns else 0)

st.markdown("---")

col1, col2 = st.columns(2)

with col1:
    st.markdown("### ⭐ Rating Distribution")
    if 'rating' in feedback.columns:
        rating_counts = feedback['rating'].value_counts().sort_index().reset_index()
        rating_counts.columns = ['Rating', 'Count']
        
        fig = px.bar(rating_counts, x='Rating', y='Count', template='plotly_dark',
                     color_discrete_sequence=[Config.COLORS['primary']])
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

with col2:
    st.markdown("### 📈 Feedback Over Time")
    feedback['date'] = feedback['created_at'].dt.date
    daily_feedback = feedback.groupby('date').size().reset_index()
    daily_feedback.columns = ['Date', 'Count']
    
    fig = px.line(daily_feedback, x='Date', y='Count', template='plotly_dark',
                  markers=True, color_discrete_sequence=[Config.COLORS['secondary']])
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

# Recent feedback
st.markdown("### 📋 Recent User Feedback")
display_df = feedback.head(50)[['name', 'rating', 'feedback', 'created_at']].copy()
display_df['created_at'] = display_df['created_at'].dt.strftime('%Y-%m-%d %H:%M')
display_df.columns = ['Name', 'Rating', 'Feedback', 'Date']
st.dataframe(display_df, use_container_width=True, height=400)
