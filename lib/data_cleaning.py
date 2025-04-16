import pandas as pd
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def clean_data(raw_csv_path):
    df = pd.read_csv(raw_csv_path)
    
    # 1. Handle missing values
    df.fillna({
        'HOME_TEAM_PTS': 0, 
        'AWAY_TEAM_PTS': 0
    }, inplace=True)
    
    # 2. Derive binary 'home_win' label
    df['home_win'] = df['HOME_TEAM_PTS'] > df['AWAY_TEAM_PTS']
    
    # 3. Standardize team names (e.g., "LA Lakers" → "Los Angeles Lakers")
    team_mapping = pd.read_csv('team_mapping.csv')  # Your custom mapping file
    df = df.merge(team_mapping, on='HOME_TEAM_NAME')
    
    return df

def upload_to_supabase(clean_df):
    # Batch insert teams first
    teams = clean_df[['team_id', 'team_name']].drop_duplicates()
    supabase.table('teams').insert(teams.to_dict('records')).execute()
    
    # Insert games
    games = clean_df[[
        'date', 'season', 'home_team_id', 'away_team_id', 
        'HOME_TEAM_PTS', 'AWAY_TEAM_PTS', 'home_win'
    ]]
    supabase.table('games').insert(games.to_dict('records')).execute()

if __name__ == "__main__":
    raw_data = "nba_games_raw.csv"
    clean_df = clean_data(raw_data)
    upload_to_supabase(clean_df)