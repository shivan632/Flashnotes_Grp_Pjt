# python/pages/4_🤖_AI_Notes_Analytics.py
import streamlit as st
import pandas as pd
import plotly.express as px
import json
from datetime import datetime
from utils.supabase_client import supabase_client
from config import Config

st.set_page_config(page_title="AI Generated Notes Analytics", page_icon="🤖", layout="wide")

st.markdown("# 🤖 AI Generated Notes Analytics")
st.markdown("Analysis of AI-generated study notes")

with st.spinner("Loading AI notes data..."):
    generated_notes = supabase_client.fetch_table('generated_notes', order_by=('generated_at', 'desc'))

if generated_notes.empty:
    st.info("No AI generated notes available yet.")
    st.stop()

generated_notes['generated_at'] = pd.to_datetime(generated_notes['generated_at'])
generated_notes['date'] = generated_notes['generated_at'].dt.date

col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric("Total Generated", len(generated_notes))
with col2:
    if 'is_favorite' in generated_notes.columns:
        st.metric("Favorite Notes", generated_notes['is_favorite'].sum())
with col3:
    if 'is_fallback' in generated_notes.columns:
        fallback_pct = (generated_notes['is_fallback'].sum() / len(generated_notes)) * 100
        st.metric("Fallback Rate", f"{fallback_pct:.1f}%")
with col4:
    if 'view_count' in generated_notes.columns:
        st.metric("Total Views", generated_notes['view_count'].sum())
with col5:
    st.metric("Unique Topics", generated_notes['topic'].nunique() if 'topic' in generated_notes.columns else 0)

st.markdown("---")

col1, col2 = st.columns(2)

with col1:
    st.markdown("### 📊 Difficulty Distribution")
    if 'difficulty' in generated_notes.columns:
        diff_counts = generated_notes['difficulty'].value_counts().reset_index()
        diff_counts.columns = ['Difficulty', 'Count']
        
        fig = px.pie(diff_counts, values='Count', names='Difficulty',
                     template='plotly_dark', color_discrete_sequence=px.colors.sequential.Plasma)
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

with col2:
    st.markdown("### 🎨 Style Distribution")
    if 'style' in generated_notes.columns:
        style_counts = generated_notes['style'].value_counts().reset_index()
        style_counts.columns = ['Style', 'Count']
        
        fig = px.bar(style_counts, x='Style', y='Count', template='plotly_dark',
                     color_discrete_sequence=[Config.COLORS['info']])
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

# Popular topics
st.markdown("### 🔥 Most Popular Topics")
topic_counts = generated_notes['topic'].value_counts().head(15).reset_index()
topic_counts.columns = ['Topic', 'Count']

fig = px.bar(topic_counts, x='Count', y='Topic', orientation='h',
             template='plotly_dark', color_discrete_sequence=[Config.COLORS['primary']])
fig.update_layout(height=500)
st.plotly_chart(fig, use_container_width=True)

# Recent notes
st.markdown("### 📋 Recent AI Generated Notes")
display_df = generated_notes.head(50)[['topic', 'difficulty', 'style', 'view_count', 'generated_at']].copy()
display_df['generated_at'] = display_df['generated_at'].dt.strftime('%Y-%m-%d %H:%M')
display_df.columns = ['Topic', 'Difficulty', 'Style', 'Views', 'Generated At']
st.dataframe(display_df, use_container_width=True, height=400)
