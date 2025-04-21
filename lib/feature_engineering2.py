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
    """Fetch raw games data"""
    response = supabase.table("games").select("*").execute()
    return pd.DataFrame(response.data)

def engineer_features(games_df):
    # Fetch advanced stats
    adv_stats = fetch_advanced_stats()
    adv_stats['date'] = pd.to_datetime(adv_stats['season'].astype(str) + '-04-15')  # Mid-season date
    
    # Convert game dates
    games_df = games_df.sort_values(by=["home_team_id", "date"])
    games_df["date"] = pd.to_datetime(games_df["date"])

    # Calculate rolling averages for home and away teams
    games_df["home_avg_pts"] = (
        games_df.groupby("home_team_id")["home_score"]
        .transform(lambda x: x.rolling(10, min_periods=3).mean())
    )

    games_df["away_avg_pts_allowed"] = (
        games_df.groupby("away_team_id")["home_score"]
        .transform(lambda x: x.rolling(10, min_periods=3).mean())
    )
    
    # 1. Add advanced stats as features
    for team_type in ['home', 'away']:
        team_col = f"{team_type}_team_id"
        
        # Merge with the most recent advanced stats before each game
        merged = pd.merge_asof(
            games_df.sort_values('date'),
            adv_stats.sort_values('date'),
            left_on='date',
            right_on='date',
            left_by=team_col,
            right_by='team_id',
            direction='backward'
        )
        
        # Add advanced stats with prefix
        for stat in ['off_rating', 'def_rating', 'net_rating', 'pace', 'ts_pct', 'efg_pct', 'plus_minus']:
            games_df[f"{team_type}_{stat}"] = merged[stat]
    
    # 2. Enhanced rolling averages (weighted by advanced stats)
    games_df = games_df.sort_values(by=["home_team_id", "date"])
    
    # Offensive rating weighted rolling average
    games_df["home_ortg_adj_avg_pts"] = (
        games_df.groupby("home_team_id", group_keys=False)
        .apply(lambda x: x["home_score"].rolling(10, min_periods=6).mean() * 
            (x["home_off_rating"] / x["home_off_rating"].mean()), include_groups=False)
    )

    # Defensive rating weighted points allowed
    games_df["away_drtg_adj_pts_allowed"] = (
        games_df.groupby("away_team_id", group_keys=False)
        .apply(lambda x: x["home_score"].rolling(10, min_periods=6).mean() * 
            (x["away_def_rating"] / x["away_def_rating"].mean()), include_groups=False)
    )
    
    # 3. Advanced win metrics
    games_df["home_net_rating_plusminus"] = games_df["home_net_rating"] + games_df["home_plus_minus"] / 100
    games_df["away_net_rating_plusminus"] = games_df["away_net_rating"] + games_df["away_plus_minus"] / 100
    
    # 4. Matchup quality features
    games_df["ortg_matchup_diff"] = games_df["home_off_rating"] - games_df["away_def_rating"]
    games_df["drtg_matchup_diff"] = games_df["away_off_rating"] - games_df["home_def_rating"]
    games_df["net_rating_diff"] = games_df["home_net_rating"] - games_df["away_net_rating"]
    
    # 5. Rest days with pace adjustment
    games_df["home_rest_days"] = games_df.groupby("home_team_id")["date"].diff().dt.days.fillna(7)
    games_df["home_rest_adj"] = games_df["home_rest_days"] * (games_df["home_pace"] / games_df["home_pace"].mean())
    
    # 6. Head-to-head with advanced stats
    for window in [5, 10, 20]:
        games_df[f"h2h_netrtg_last_{window}"] = (
            games_df.groupby(["home_team_id", "away_team_id"], group_keys=False)
            .apply(lambda x: (x["home_net_rating"] - x["away_net_rating"])
                  .shift().rolling(window, min_periods=3).mean(), include_groups=False)
        )
    
    # Filter out preseason and incomplete records
    required_cols = ['home_avg_pts', 'away_avg_pts_allowed', 
                    'home_off_rating', 'away_def_rating']
    games_df = games_df.dropna(subset=required_cols)
    
    return games_df

# Main execution
if __name__ == "__main__":
    games_df = fetch_games()
    engineered_df = engineer_features(games_df)
    
    # Save to CSV
    engineered_df.to_csv("models/nba_ml_ready2.csv", index=False)
    
    # Optional: Save back to Supabase
    # supabase.table("ml_ready_games").upsert(engineered_df.to_dict('records')).execute()