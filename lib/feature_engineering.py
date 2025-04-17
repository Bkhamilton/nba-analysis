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
    df = df.sort_values(by=["home_team_id", "date"])
    
    # 1. Rolling stats for home team (offense)
    df["home_avg_pts"] = df.groupby("home_team_id")["home_score"].transform(
        lambda x: x.rolling(10, min_periods=3).mean()
    )
    
    # 2. Rolling stats for away team (defense)
    df["away_avg_pts_allowed"] = df.groupby("away_team_id")["home_score"].transform(
        lambda x: x.rolling(10, min_periods=3).mean()  # Home score = away team's points allowed
    )
    
    # 3. Win % (last 20 games)
    df["home_win_pct"] = df.groupby("home_team_id")["home_win"].transform(
        lambda x: x.rolling(20, min_periods=5).mean()
    )
    
    # 4. Rest days
    df["date"] = pd.to_datetime(df["date"])
    df["home_rest_days"] = df.groupby("home_team_id")["date"].diff().dt.days.fillna(7)
    
    # Filter out preseason and incomplete records
    df = df.dropna(subset=["home_avg_pts", "away_avg_pts_allowed"])
    
    return df

# Save to Supabase or CSV
df = fetch_games()
engineered_df = engineer_features(df)
engineered_df.to_csv("nba_ml_ready.csv", index=False)