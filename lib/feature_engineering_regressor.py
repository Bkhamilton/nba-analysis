import pandas as pd
from supabase import create_client
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

# Connect to Supabase
supabase = create_client(os.getenv("NEXT_PUBLIC_SUPABASE_URL"), os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY"))

def fetch_advanced_stats():
    """Fetch the latest advanced stats for all teams"""
    response = supabase.table("team_advanced_stats").select("*").execute()
    return pd.DataFrame(response.data)

def fetch_games():
    """Fetch raw games data with additional stats needed for spread prediction"""
    response = supabase.table("games").select("""
        *, 
        home_team:home_team_id(name, abbreviation),
        away_team:away_team_id(name, abbreviation)
    """).execute()
    df = pd.DataFrame(response.data)
    
    # Drop the season_type column if it exists
    if "season_type" in df.columns:
        df.drop(columns=["season_type"], inplace=True)
    
    return df

def engineer_features(df):
    # Convert date and sort
    df["date"] = pd.to_datetime(df["date"])
    adv_stats = fetch_advanced_stats()
    df = df.sort_values(by=["home_team_id", "date"])
    
    # Add a season column to games_df based on the game date
    df["season"] = df["date"].dt.year.where(
        df["date"].dt.month >= 10,  # If the month is October or later, it's the current year
        df["date"].dt.year - 1      # Otherwise, it's the previous year
    )

    # Merge advanced stats for home and away teams
    for team_type in ['home', 'away']:
        team_col = f"{team_type}_team_id"
        merged = pd.merge(
            df,
            adv_stats,
            left_on=[team_col, 'season'],
            right_on=['team_id', 'season'],
            how='left'
        )
        
        # Add pace from advanced stats
        df[f"{team_type}_pace"] = merged["pace"]

    # 1. Base features (shared with win probability model)
    df["home_avg_pts"] = df.groupby("home_team_id")["home_score"].transform(
        lambda x: x.rolling(10, min_periods=3).mean()
    )
    df["away_avg_pts_allowed"] = df.groupby("away_team_id")["home_score"].transform(
        lambda x: x.rolling(10, min_periods=3).mean()
    )
    df["home_net_rating"] = (
        df.groupby("home_team_id")["home_score"].transform(
            lambda x: x.rolling(10).mean()
        ) - df.groupby("home_team_id")["away_score"].transform(
            lambda x: x.rolling(10).mean()
        )
    )
    df["away_net_rating"] = (
        df.groupby("away_team_id")["away_score"].transform(
            lambda x: x.rolling(10).mean()
        ) - df.groupby("away_team_id")["home_score"].transform(
            lambda x: x.rolling(10).mean()
        )
    )

    # 2. Spread-specific features
    # Actual point spread (target variable)
    df["point_spread"] = df["home_score"] - df["away_score"]
    
    # Rolling average margins
    df["home_avg_margin"] = df.groupby("home_team_id")["point_spread"].transform(
        lambda x: x.rolling(10, min_periods=3).mean()
    )
    df["away_avg_margin"] = df.groupby("away_team_id")["point_spread"].transform(
        lambda x: x.rolling(10, min_periods=3).mean()
    )
    
    # Volatility metrics
    df["home_margin_std"] = df.groupby("home_team_id")["point_spread"].transform(
        lambda x: x.rolling(20, min_periods=5).std()
    )
    df["away_margin_std"] = df.groupby("away_team_id")["point_spread"].transform(
        lambda x: x.rolling(20, min_periods=5).std()
    )
    
    # Pace-adjusted features
    df["pace_diff"] = df["home_pace"] - df["away_pace"]
    
    # 3. Rest days with spread adjustment
    df["home_rest_days"] = df.groupby("home_team_id")["date"].diff().dt.days.fillna(7)
    df["rest_adjusted_spread"] = df["home_avg_margin"] * (1 + (df["home_rest_days"] - 3) * 0.02)
    
    # 4. Head-to-head spread history
    df["h2h_avg_spread"] = df.groupby(["home_team_id", "away_team_id"])["point_spread"].transform(
        lambda x: x.shift().rolling(5, min_periods=2).mean()
    )
    
    # Handle missing values
    print("Missing values per column before handling:")
    print(df.isnull().sum())
    
    # Fill missing values with reasonable defaults
    df["home_pace"] = df["home_pace"].fillna(df["home_pace"].mean())
    df["away_pace"] = df["away_pace"].fillna(df["away_pace"].mean())
    df["home_net_rating"] = df["home_net_rating"].fillna(0)
    df["away_net_rating"] = df["away_net_rating"].fillna(0)
    df["home_avg_margin"] = df["home_avg_margin"].fillna(0)
    df["away_avg_margin"] = df["away_avg_margin"].fillna(0)
    df["home_margin_std"] = df["home_margin_std"].fillna(0)
    df["away_margin_std"] = df["away_margin_std"].fillna(0)
    df["h2h_avg_spread"] = df["h2h_avg_spread"].fillna(0)
    
    # Drop rows with critical missing values
    required_cols = [
        'home_avg_pts', 'away_avg_pts_allowed',
        'home_net_rating', 'home_avg_margin'
    ]
    df = df.dropna(subset=required_cols)
    
    print("Missing values per column after handling:")
    print(df.isnull().sum())
    
    return df

# Main execution
if __name__ == "__main__":
    games_df = fetch_games()
    engineered_df = engineer_features(games_df)
    
    # Save for both models
    engineered_df.to_csv("models/nba_ml_ready_with_spread.csv", index=False)
    
    # Optional: Save back to Supabase
    # supabase.table("ml_ready_games").upsert(engineered_df.to_dict('records')).execute()