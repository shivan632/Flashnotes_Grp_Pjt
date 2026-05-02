# python/utils/supabase_client.py
import pandas as pd
import streamlit as st
from supabase import create_client, Client
from config import Config
from datetime import datetime, timedelta
import json

class SupabaseClient:
    def __init__(self):
        """Initialize Supabase connection"""
        self.url = Config.SUPABASE_URL
        self.key = Config.SUPABASE_SERVICE_KEY
        
        # Validate credentials
        if not self.url or not self.key:
            st.error("""
            ❌ **Supabase credentials not configured!**
            
            **For local development:**
            Create a `.env` file with:
            SUPABASE_URL=your-project-url
            SUPABASE_SERVICE_KEY=your-service-role-key
            
            **For Streamlit Cloud:**
            Go to Settings → Secrets and add:
            SUPABASE_URL = "your-project-url"
            SUPABASE_SERVICE_KEY = "your-service-role-key"
            """)
            self.client = None
            return

        try:
            self.client: Client = create_client(self.url, self.key)
            print("✅ Supabase client initialized successfully")
        except Exception as e:
            st.error(f"❌ Failed to initialize Supabase client: {str(e)}")
            self.client = None

    @st.cache_data(ttl=Config.CACHE_TTL)
    def fetch_table(_self, table_name, limit=None, filters=None, order_by=None):
        """Fetch data from any table"""
        if _self.client is None:
            return pd.DataFrame()

        try:
            query = _self.client.table(table_name).select("*")

            if filters:
                for f in filters:
                    operator = f.get('operator', 'eq')
                    column = f['column']
                    value = f['value']
                    
                    if operator == 'eq':
                        query = query.eq(column, value)
                    elif operator == 'gt':
                        query = query.gt(column, value)
                    elif operator == 'lt':
                        query = query.lt(column, value)
                    elif operator == 'gte':
                        query = query.gte(column, value)
                    elif operator == 'lte':
                        query = query.lte(column, value)
                    elif operator == 'like':
                        query = query.like(column, f"%{value}%")

            if order_by:
                query = query.order(order_by[0], desc=order_by[1] == 'desc')

            if limit:
                query = query.limit(limit)

            response = query.execute()

            if response.data:
                df = pd.DataFrame(response.data)
                
                # Convert timestamp columns to timezone-naive
                for col in df.columns:
                    if 'created_at' in col.lower() or 'updated_at' in col.lower() or 'generated_at' in col.lower():
                        try:
                            df[col] = pd.to_datetime(df[col])
                            # Remove timezone info if present
                            if df[col].dt.tz is not None:
                                df[col] = df[col].dt.tz_localize(None)
                        except:
                            pass
                    # Parse JSON content for generated_notes
                    if col == 'content' and table_name == 'generated_notes':
                        try:
                            df[col] = df[col].apply(lambda x: json.loads(x) if isinstance(x, str) else x)
                        except:
                            pass
                
                return df
            return pd.DataFrame()

        except Exception as e:
            st.error(f"Error fetching {table_name}: {str(e)}")
            return pd.DataFrame()

    @st.cache_data(ttl=Config.CACHE_TTL)
    def get_user_analytics(_self):
        """Get detailed user analytics"""
        if _self.client is None:
            return {}

        users = _self.fetch_table('users')

        if users.empty:
            return {}

        users['created_at'] = pd.to_datetime(users['created_at'])

        # Remove timezone for grouping
        if users['created_at'].dt.tz is not None:
            users['created_at'] = users['created_at'].dt.tz_localize(None)

        analytics = {
            'total_users': len(users),
            'verified_users': users['email_verified'].sum() if 'email_verified' in users.columns else 0,
            'users_by_month': users.groupby(users['created_at'].dt.strftime('%Y-%m')).size().to_dict(),
            'recent_users': len(users[users['created_at'] >= (datetime.now() - timedelta(days=30))]),
            'users_with_bio': users['bio'].notna().sum() if 'bio' in users.columns else 0,
            'sample_users': users.head(10).to_dict('records')
        }

        return analytics

    @st.cache_data(ttl=Config.CACHE_TTL)
    def get_voice_notes_analytics(_self):
        """Get comprehensive voice notes analytics"""
        if _self.client is None:
            return {}

        df = _self.fetch_table('voice_notes')

        if df.empty:
            return {}

        df['created_at'] = pd.to_datetime(df['created_at'])

        # Remove timezone for grouping
        if df['created_at'].dt.tz is not None:
            df['created_at'] = df['created_at'].dt.tz_localize(None)

        analytics = {
            'total_notes': len(df),
            'total_words': df['word_count'].sum() if 'word_count' in df.columns else 0,
            'total_chars': df['char_count'].sum() if 'char_count' in df.columns else 0,
            'avg_words_per_note': df['word_count'].mean() if 'word_count' in df.columns else 0,
            'avg_chars_per_note': df['char_count'].mean() if 'char_count' in df.columns else 0,
            'favorite_notes': df['is_favorite'].sum() if 'is_favorite' in df.columns else 0,
            'unique_users': df['user_id'].nunique() if 'user_id' in df.columns else 0,
            'notes_by_date': df.groupby(df['created_at'].dt.date).size().to_dict(),
            'notes_by_hour': df.groupby(df['created_at'].dt.hour).size().to_dict(),
            'notes_by_day': df.groupby(df['created_at'].dt.day_name()).size().to_dict(),
            'word_distribution': df['word_count'].value_counts().sort_index().head(20).to_dict() if 'word_count' in df.columns else {},
            'top_users': df['user_id'].value_counts().head(10).to_dict() if 'user_id' in df.columns else {},
            'recent_notes': df.nlargest(10, 'created_at')[['text', 'word_count', 'created_at']].to_dict('records')
        }

        return analytics

    @st.cache_data(ttl=Config.CACHE_TTL)
    def get_generated_notes_analytics(_self):
        """Get AI generated notes analytics"""
        if _self.client is None:
            return {}

        df = _self.fetch_table('generated_notes')

        if df.empty:
            return {}

        df['generated_at'] = pd.to_datetime(df['generated_at'])

        # Remove timezone for grouping
        if df['generated_at'].dt.tz is not None:
            df['generated_at'] = df['generated_at'].dt.tz_localize(None)

        analytics = {
            'total_notes': len(df),
            'favorite_notes': df['is_favorite'].sum() if 'is_favorite' in df.columns else 0,
            'fallback_notes': df['is_fallback'].sum() if 'is_fallback' in df.columns else 0,
            'unique_users': df['user_id'].nunique() if 'user_id' in df.columns else 0,
            'total_views': df['view_count'].sum() if 'view_count' in df.columns else 0,
            'difficulty_distribution': df['difficulty'].value_counts().to_dict() if 'difficulty' in df.columns else {},
            'style_distribution': df['style'].value_counts().to_dict() if 'style' in df.columns else {},
            'top_topics': df['topic'].value_counts().head(10).to_dict() if 'topic' in df.columns else {},
            'notes_by_date': df.groupby(df['generated_at'].dt.date).size().to_dict(),
            'recent_notes': df.nlargest(10, 'generated_at')[['topic', 'difficulty', 'view_count']].to_dict('records')
        }

        return analytics

    @st.cache_data(ttl=Config.CACHE_TTL)
    def get_quiz_analytics(_self):
        """Get quiz performance analytics"""
        if _self.client is None:
            return {}

        attempts = _self.fetch_table('quiz_attempts')
        questions = _self.fetch_table('quiz_questions')

        analytics = {
            'total_attempts': len(attempts),
            'unique_users': attempts['user_id'].nunique() if 'user_id' in attempts.columns else 0,
            'total_questions': len(questions) if not questions.empty else 0,
        }

        if not attempts.empty:
            if 'score' in attempts.columns:
                analytics['avg_score'] = attempts['score'].mean()
                analytics['max_score'] = attempts['score'].max()
                analytics['min_score'] = attempts['score'].min()

            if 'percentage' in attempts.columns:
                analytics['avg_percentage'] = attempts['percentage'].mean()
                analytics['pass_rate'] = (attempts['percentage'] >= 60).mean() * 100 if 'percentage' in attempts.columns else 0

            if 'correct_count' in attempts.columns and 'total_questions' in attempts.columns:
                analytics['total_correct_answers'] = attempts['correct_count'].sum()
                analytics['total_questions_answered'] = attempts['total_questions'].sum()

            if 'time_taken_seconds' in attempts.columns:
                analytics['avg_time_taken'] = attempts['time_taken_seconds'].mean()

            attempts['created_at'] = pd.to_datetime(attempts['created_at'])
            if attempts['created_at'].dt.tz is not None:
                attempts['created_at'] = attempts['created_at'].dt.tz_localize(None)

            analytics['attempts_by_date'] = attempts.groupby(attempts['created_at'].dt.date).size().to_dict()
            analytics['score_distribution'] = attempts['score'].value_counts().sort_index().to_dict() if 'score' in attempts.columns else {}

        return analytics

    @st.cache_data(ttl=Config.CACHE_TTL)
    def get_feedback_analytics(_self):
        """Get user feedback analytics"""
        if _self.client is None:
            return {}

        df = _self.fetch_table('feedback')

        if df.empty:
            return {}

        df['created_at'] = pd.to_datetime(df['created_at'])

        # Remove timezone for grouping
        if df['created_at'].dt.tz is not None:
            df['created_at'] = df['created_at'].dt.tz_localize(None)

        analytics = {
            'total_feedback': len(df),
            'avg_rating': df['rating'].mean() if 'rating' in df.columns else 0,
            'rating_distribution': df['rating'].value_counts().sort_index().to_dict() if 'rating' in df.columns else {},
            'feedback_by_month': df.groupby(df['created_at'].dt.strftime('%Y-%m')).size().to_dict(),
            'recent_feedback': df.nlargest(10, 'created_at')[['name', 'rating', 'feedback', 'created_at']].to_dict('records')
        }

        return analytics

    @st.cache_data(ttl=Config.CACHE_TTL)
    def get_roadmap_analytics(_self):
        """Get roadmap analytics"""
        if _self.client is None:
            return {}

        df = _self.fetch_table('roadmaps')

        if df.empty:
            return {}

        df['created_at'] = pd.to_datetime(df['created_at'])

        # Remove timezone for grouping
        if df['created_at'].dt.tz is not None:
            df['created_at'] = df['created_at'].dt.tz_localize(None)

        analytics = {
            'total_roadmaps': len(df),
            'unique_users': df['user_id'].nunique() if 'user_id' in df.columns else 0,
            'total_views': df['view_count'].sum() if 'view_count' in df.columns else 0,
            'total_saves': df['save_count'].sum() if 'save_count' in df.columns else 0,
            'difficulty_distribution': df['difficulty'].value_counts().to_dict() if 'difficulty' in df.columns else {},
            'top_topics': df['topic'].value_counts().head(10).to_dict() if 'topic' in df.columns else {},
            'roadmaps_by_month': df.groupby(df['created_at'].dt.strftime('%Y-%m')).size().to_dict(),
            'recent_roadmaps': df.nlargest(10, 'created_at')[['topic', 'difficulty', 'view_count']].to_dict('records')
        }

        return analytics

    @st.cache_data(ttl=Config.CACHE_TTL)
    def get_saved_notes_analytics(_self):
        """Get saved notes analytics"""
        if _self.client is None:
            return {}

        df = _self.fetch_table('saved_notes')

        if df.empty:
            return {}

        df['created_at'] = pd.to_datetime(df['created_at'])

        # Remove timezone for grouping
        if df['created_at'].dt.tz is not None:
            df['created_at'] = df['created_at'].dt.tz_localize(None)

        analytics = {
            'total_saved_notes': len(df),
            'unique_users': df['user_id'].nunique() if 'user_id' in df.columns else 0,
            'unique_topics': df['topic'].nunique() if 'topic' in df.columns else 0,
            'top_topics': df['topic'].value_counts().head(10).to_dict() if 'topic' in df.columns else {},
            'saved_by_month': df.groupby(df['created_at'].dt.strftime('%Y-%m')).size().to_dict(),
            'recent_saved': df.nlargest(10, 'created_at')[['topic', 'question', 'created_at']].to_dict('records')
        }

        return analytics

# Initialize client only if credentials are available
if Config.SUPABASE_URL and Config.SUPABASE_SERVICE_KEY:
    supabase_client = SupabaseClient()
else:
    supabase_client = None
    print("⚠️ Supabase client not initialized due to missing credentials")