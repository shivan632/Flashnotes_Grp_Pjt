# python/pages/5_👥_Users_Analytics.py
import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
from utils.supabase_client import supabase_client
from config import Config

st.set_page_config(page_title="Users Analytics", page_icon="👥", layout="wide")

st.markdown("# 👥 Users Analytics")
st.markdown("User registration and engagement analysis")

with st.spinner("Loading user data..."):
    users = supabase_client.fetch_table('users', order_by=('created_at', 'desc'))

if users.empty:
    st.info("No user data available.")
    st.stop()

users['created_at'] = pd.to_datetime(users['created_at'])
users['date'] = users['created_at'].dt.date
users['month'] = users['created_at'].dt.strftime('%Y-%m')

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Total Users", len(users))
with col2:
    verified_count = users['email_verified'].sum() if 'email_verified' in users.columns else 0
    verified_pct = (verified_count / len(users)) * 100
    st.metric("Verified Users", f"{verified_pct:.1f}%")
with col3:
    last_7_days = len(users[users['created_at'] >= datetime.now() - timedelta(days=7)])
    st.metric("New Users (7d)", last_7_days)
with col4:
    users_with_bio = users['bio'].notna().sum() if 'bio' in users.columns else 0
    st.metric("Users with Bio", users_with_bio)

st.markdown("---")

col1, col2 = st.columns(2)

with col1:
    st.markdown("### 📈 User Registrations Over Time")
    daily_reg = users.groupby('date').size().reset_index()
    daily_reg.columns = ['Date', 'Registrations']
    
    fig = px.line(daily_reg, x='Date', y='Registrations', template='plotly_dark',
                  markers=True, color_discrete_sequence=[Config.COLORS['primary']])
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.markdown("### 📊 Monthly Registrations")
    monthly_reg = users.groupby('month').size().reset_index()
    monthly_reg.columns = ['Month', 'Registrations']
    
    fig = px.bar(monthly_reg, x='Month', y='Registrations', template='plotly_dark',
                 color_discrete_sequence=[Config.COLORS['secondary']])
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

# User list
st.markdown("### 📋 Registered Users")
display_df = users[['name', 'email', 'created_at', 'email_verified']].head(100).copy()
display_df['created_at'] = display_df['created_at'].dt.strftime('%Y-%m-%d %H:%M')
display_df['email_verified'] = display_df['email_verified'].map({True: '✅', False: '❌'})
display_df.columns = ['Name', 'Email', 'Registered At', 'Verified']
st.dataframe(display_df, use_container_width=True, height=400)