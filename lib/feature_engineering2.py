import pandas as pd
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to Supabase
supabase = create_client(os.getenv("NEXT_PUBLIC_SUPABASE_URL"), os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY"))

# Fetch raw games data
def fetch_games():
    response = supabase.table("games").select("*").execute()
    return pd.DataFrame(response.data)

# Calculate rolling averages and other features
def engineer_features(df):
    # Ensure the 'date' column is in datetime format
    df['date'] = pd.to_datetime(df['date'])

    df = df.sort_values(['home_team_id', 'date'])
    
    # Existing features
    df['home_avg_pts'] = df.groupby('home_team_id')['home_score'].transform(lambda x: x.rolling(10, 3).mean())
    df['away_avg_pts_allowed'] = df.groupby('away_team_id')['home_score'].transform(lambda x: x.rolling(10, 3).mean())
    df['home_win_pct'] = df.groupby('home_team_id')['home_win'].transform(lambda x: x.rolling(20, 5).mean())
    df['home_rest_days'] = df.groupby('home_team_id')['date'].diff().dt.days.fillna(7)

    # New advanced features
    # 1. Net Rating Differential (Offensive - Defensive Efficiency)
    df['home_net_rtg'] = df.groupby('home_team_id')['home_score'].transform(
        lambda x: x.rolling(10, 3).mean() - x.rolling(10, 3).std()
    )
    df['away_net_rtg'] = df.groupby('away_team_id')['away_score'].transform(
        lambda x: x.rolling(10, 3).mean() - x.rolling(10, 3).std()
    )
    
    # 2. Head-to-Head History (Last 3 matchups)
    df['h2h_win_pct'] = df.apply(
        lambda row: df[
            (df['home_team_id'] == row['home_team_id']) & 
            (df['away_team_id'] == row['away_team_id'])
        ].iloc[-3:]['home_win'].mean() if len(df[
            (df['home_team_id'] == row['home_team_id']) & 
            (df['away_team_id'] == row['away_team_id'])
        ]) >= 3 else 0.5, axis=1
    )
    
    # 3. Strength of Schedule (Opponent's avg win %)
    df['home_sos'] = df.groupby('home_team_id')['away_team_id'].transform(
        lambda x: x.map(df.groupby('away_team_id')['home_win'].mean())
    )
    
    # 4. Home/Away Performance Differential
    df['home_away_diff'] = df.groupby('home_team_id')['home_win'].transform('mean') - \
                          df.groupby('away_team_id')['home_win'].transform(lambda x: 1 - x.mean())
    
    return df.dropna()

# Save to Supabase or CSV
df = fetch_games()
engineered_df = engineer_features(df)
engineered_df.to_csv("nba_ml_ready.csv", index=False)