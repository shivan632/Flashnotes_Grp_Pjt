# python/pages/8_🗺️_Roadmap_Analytics.py
import streamlit as st
import pandas as pd
import plotly.express as px
from utils.supabase_client import supabase_client
from config import Config

st.set_page_config(page_title="Roadmap Analytics", page_icon="🗺️", layout="wide")

st.markdown("# 🗺️ Learning Roadmap Analytics")
st.markdown("Analysis of created learning roadmaps")

with st.spinner("Loading roadmap data..."):
    roadmaps = supabase_client.fetch_table('roadmaps', order_by=('created_at', 'desc'))

if roadmaps.empty:
    st.info("No roadmaps created yet.")
    st.stop()

roadmaps['created_at'] = pd.to_datetime(roadmaps['created_at'])

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Total Roadmaps", len(roadmaps))
with col2:
    st.metric("Unique Topics", roadmaps['topic'].nunique() if 'topic' in roadmaps.columns else 0)
with col3:
    if 'view_count' in roadmaps.columns:
        st.metric("Total Views", roadmaps['view_count'].sum())
with col4:
    if 'save_count' in roadmaps.columns:
        st.metric("Total Saves", roadmaps['save_count'].sum())

st.markdown("---")

col1, col2 = st.columns(2)

with col1:
    st.markdown("### 🔥 Most Popular Topics")
    topic_counts = roadmaps['topic'].value_counts().head(10).reset_index()
    topic_counts.columns = ['Topic', 'Count']
    
    fig = px.bar(topic_counts, x='Count', y='Topic', orientation='h',
                 template='plotly_dark', color_discrete_sequence=[Config.COLORS['primary']])
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.markdown("### 📊 Difficulty Distribution")
    if 'difficulty' in roadmaps.columns:
        diff_counts = roadmaps['difficulty'].value_counts().reset_index()
        diff_counts.columns = ['Difficulty', 'Count']
        
        fig = px.pie(diff_counts, values='Count', names='Difficulty',
                     template='plotly_dark', color_discrete_sequence=px.colors.sequential.Plasma)
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

# Recent roadmaps
st.markdown("### 📋 Recent Roadmaps")
display_df = roadmaps.head(50)[['topic', 'difficulty', 'view_count', 'save_count', 'created_at']].copy()
display_df['created_at'] = display_df['created_at'].dt.strftime('%Y-%m-%d %H:%M')
display_df.columns = ['Topic', 'Difficulty', 'Views', 'Saves', 'Created At']
st.dataframe(display_df, use_container_width=True, height=400)