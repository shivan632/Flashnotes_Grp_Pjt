# utils/visualizations.py
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from config import Config

class Visualizations:
    @staticmethod
    def create_line_chart(df, x_col, y_col, title, color=None):
        """Create an interactive line chart"""
        if df.empty:
            st.warning("No data available for chart")
            return
        
        fig = px.line(
            df, 
            x=x_col, 
            y=y_col, 
            title=title,
            color=color,
            markers=True,
            template='plotly_dark'
        )
        
        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white'),
            title_font=dict(size=20, color=Config.COLORS['primary'])
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    @staticmethod
    def create_bar_chart(df, x_col, y_col, title, orientation='v'):
        """Create a bar chart"""
        if df.empty:
            st.warning("No data available for chart")
            return
        
        fig = px.bar(
            df,
            x=x_col if orientation == 'v' else y_col,
            y=y_col if orientation == 'v' else x_col,
            title=title,
            color_discrete_sequence=[Config.COLORS['primary']],
            orientation=orientation,
            template='plotly_dark'
        )
        
        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white')
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    @staticmethod
    def create_pie_chart(df, names_col, values_col, title):
        """Create a pie chart"""
        if df.empty:
            st.warning("No data available for chart")
            return
        
        fig = px.pie(
            df,
            names=names_col,
            values=values_col,
            title=title,
            color_discrete_sequence=px.colors.sequential.Plasma,
            template='plotly_dark'
        )
        
        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white')
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    @staticmethod
    def create_histogram(df, column, title, bins=30):
        """Create a histogram"""
        if df.empty or column not in df.columns:
            st.warning("No data available for histogram")
            return
        
        fig = px.histogram(
            df,
            x=column,
            nbins=bins,
            title=title,
            color_discrete_sequence=[Config.COLORS['secondary']],
            template='plotly_dark'
        )
        
        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white')
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    @staticmethod
    def create_heatmap(df, title):
        """Create a correlation heatmap"""
        if df.empty:
            st.warning("No data available for heatmap")
            return
        
        # Select only numeric columns
        numeric_df = df.select_dtypes(include=[np.number])
        
        if numeric_df.empty:
            st.warning("No numeric columns for correlation")
            return
        
        corr_matrix = numeric_df.corr()
        
        fig = px.imshow(
            corr_matrix,
            text_auto=True,
            aspect="auto",
            title=title,
            color_continuous_scale='RdBu',
            template='plotly_dark'
        )
        
        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white')
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    @staticmethod
    def create_gauge_chart(value, title, min_val=0, max_val=100):
        """Create a gauge chart for KPIs"""
        fig = go.Figure(go.Indicator(
            mode="gauge+number",
            value=value,
            title={'text': title, 'font': {'color': 'white'}},
            gauge={
                'axis': {'range': [min_val, max_val], 'tickcolor': 'white'},
                'bar': {'color': Config.COLORS['primary']},
                'bgcolor': 'rgba(0,0,0,0)',
                'borderwidth': 0,
                'steps': [
                    {'range': [0, max_val * 0.5], 'color': 'rgba(99, 102, 241, 0.2)'},
                    {'range': [max_val * 0.5, max_val], 'color': 'rgba(236, 72, 153, 0.2)'}
                ]
            }
        ))
        
        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white')
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    @staticmethod
    def display_metric_card(title, value, delta=None, icon=None):
        """Display a styled metric card"""
        with st.container():
            col1, col2 = st.columns([3, 1])
            with col1:
                st.metric(title, value, delta)
            with col2:
                if icon:
                    st.markdown(f"<h1 style='text-align: right;'>{icon}</h1>", unsafe_allow_html=True)

viz = Visualizations()