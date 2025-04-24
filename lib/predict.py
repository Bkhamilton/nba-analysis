import sys
import json
import joblib
import numpy as np
import pandas as pd
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase
supabase = create_client(
    os.getenv("NEXT_PUBLIC_SUPABASE_URL"),
    os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
)

def fetch_advanced_team_stats(team_id):
    """Fetch advanced team stats using RPC functions"""
    try:
        response = supabase.rpc('get_advanced_team_stats', {'team_id_input': team_id}).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error fetching advanced team stats: {str(e)}", file=sys.stderr)
        return None

def fetch_team_stats(team_id, is_home=True):
    """Fetch team-specific stats using RPC functions"""
    try:
        func_name = 'get_home_team_stats' if is_home else 'get_away_team_stats'
        response = supabase.rpc(func_name, {'team_id': team_id}).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error fetching team stats: {str(e)}", file=sys.stderr)
        return None
    
def fetch_all_team_stats(team_id, is_home=True):
    """Fetch team-specific and advanced team stats using fetch functions"""
    try:
        team_stats = fetch_team_stats(team_id, is_home)
        advanced_stats = fetch_advanced_team_stats(team_id)
        
        if team_stats and advanced_stats:
            combined_stats = {**team_stats, **advanced_stats}
            return combined_stats
        else:
            return None
    except Exception as e:
        print(f"Error fetching all team stats: {str(e)}", file=sys.stderr)
        return None
    
def fetch_advanced_head_to_head_stats(home_team_id, away_team_id):
    """Fetch advanced head-to-head stats using RPC functions"""
    try:
        response = supabase.rpc('get_advanced_head_to_head_stats', {
            'home_team_id_input': home_team_id,
            'away_team_id_input': away_team_id
        }).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error fetching advanced H2H stats: {str(e)}", file=sys.stderr)
        return None

def fetch_head_to_head_stats(home_team_id, away_team_id):
    """Fetch historical matchup data between teams"""
    try:
        response = supabase.rpc('get_head_to_head_stats', {
            'home_team_id': home_team_id,
            'away_team_id': away_team_id
        }).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error fetching H2H stats: {str(e)}", file=sys.stderr)
        return None
    
def fetch_all_head_to_head_stats(home_team_id, away_team_id):
    """Fetch all head-to-head stats including advanced stats"""
    try:
        h2h_stats = fetch_head_to_head_stats(home_team_id, away_team_id)
        advanced_h2h_stats = fetch_advanced_head_to_head_stats(home_team_id, away_team_id)
        
        if h2h_stats and advanced_h2h_stats:
            combined_h2h_stats = {**h2h_stats, **advanced_h2h_stats}
            return combined_h2h_stats
        else:
            return None
    except Exception as e:
        print(f"Error fetching all H2H stats: {str(e)}", file=sys.stderr)
        return None

def prepare_features_for_model1(home_team_id, away_team_id, home_rest_days):
    """Compile all features in exact training order"""
    # Fetch all required data
    home_stats = fetch_team_stats(home_team_id, is_home=True)
    away_stats = fetch_team_stats(away_team_id, is_home=False)
    
    # Fallback values if data is missing
    default_values = {
        'avg_pts': 110.0,           # League average
        'avg_pts_allowed': 110.0,    # League average
        'win_pct': 0.5,              # Neutral win probability
        'home_net_rating': 0.0,        # No net rating assumption
    }
    
    # Prepare features in EXACT same order as model training
    return [
        home_stats['avg_pts'] if home_stats else default_values['avg_pts'],
        away_stats['avg_pts'] if away_stats else default_values['avg_pts'],
        away_stats['avg_pts_allowed'] if away_stats else default_values['avg_pts_allowed'],
        home_stats['win_pct'] if home_stats else default_values['win_pct'],
        home_stats['home_net_rating'] if home_stats else default_values['home_net_rating'],
        home_rest_days,
    ]

def prepare_features_for_model2(home_team_id, away_team_id, home_rest_days):
    """Feature preparation for the advanced model"""
    home_stats = fetch_all_team_stats(home_team_id)
    away_stats = fetch_all_team_stats(away_team_id)
    h2h_stats = fetch_all_head_to_head_stats(home_team_id, away_team_id)
    
    default_values = {
        'avg_pts': 110.0,
        'avg_pts_allowed': 110.0,
        'off_rating': 110.0,
        'def_rating': 110.0,
        'net_rating': 0.0,
        'pace': 100.0,
        'ts_pct': 0.56,
        'efg_pct': 0.52,
        'plus_minus': 0.0,
        'ortg_adj_avg_pts': 110.0,
        'drtg_adj_pts_allowed': 110.0,
        'net_rating_plusminus': 0.0,
        'ortg_matchup_diff': 0.0,
        'drtg_matchup_diff': 0.0,
        'net_rating_diff': 0.0,
        'netrtg_last_5': 0.0,
        'netrtg_last_10': 0.0,
        'netrtg_last_20': 0.0
    }

    # Calculate derived features
    home_rest_adj = home_rest_days * (home_stats['pace'] / 98.8) if home_stats else default_values['pace']
    home_ortg_adj_avg_pts = (
        home_stats['avg_pts'] * (home_stats['off_rating'] / 114.5) if home_stats else default_values['ortg_adj_avg_pts']
    )
    away_drtg_adj_pts_allowed = (
        home_stats['avg_pts'] * (away_stats['def_rating'] / 114.5) if away_stats else default_values['drtg_adj_pts_allowed']
    )
    home_net_rating_plusminus = (
        home_stats['net_rating'] + home_stats['plus_minus'] / 100 if home_stats else default_values['net_rating_plusminus']
    )
    away_net_rating_plusminus = (
        away_stats['net_rating'] + away_stats['plus_minus'] / 100 if away_stats else default_values['net_rating_plusminus']
    )
    ortg_matchup_diff = (
        home_stats['off_rating'] - away_stats['def_rating'] if home_stats and away_stats else default_values['ortg_matchup_diff']
    )
    drtg_matchup_diff = (
        away_stats['off_rating'] - home_stats['def_rating'] if home_stats and away_stats else default_values['drtg_matchup_diff']
    )
    net_rating_diff = (
        home_stats['net_rating'] - away_stats['net_rating'] if home_stats and away_stats else default_values['net_rating_diff']
    )

    # Safely retrieve H2H stats with default values
    netrtg_last_5 = h2h_stats.get('netrtg_last_5', default_values['netrtg_last_5'])
    netrtg_last_10 = h2h_stats.get('netrtg_last_10', default_values['netrtg_last_10'])
    netrtg_last_20 = h2h_stats.get('netrtg_last_20', default_values['netrtg_last_20'])

    # Return features in the correct order
    return [
        home_stats['avg_pts'] if home_stats else default_values['avg_pts'],  # home_avg_pts
        away_stats['avg_pts_allowed'] if away_stats else default_values['avg_pts_allowed'],  # away_avg_pts_allowed
        home_stats['off_rating'] if home_stats else default_values['off_rating'],  # home_off_rating
        away_stats['def_rating'] if away_stats else default_values['def_rating'],  # away_def_rating
        home_stats['net_rating'] if home_stats else default_values['net_rating'],  # home_net_rating
        away_stats['net_rating'] if away_stats else default_values['net_rating'],  # away_net_rating
        home_stats['pace'] if home_stats else default_values['pace'],  # home_pace
        away_stats['pace'] if away_stats else default_values['pace'],  # away_pace
        home_stats['ts_pct'] if home_stats else default_values['ts_pct'],  # home_ts_pct
        away_stats['ts_pct'] if away_stats else default_values['ts_pct'],  # away_ts_pct
        home_stats['efg_pct'] if home_stats else default_values['efg_pct'],  # home_efg_pct
        away_stats['efg_pct'] if away_stats else default_values['efg_pct'],  # away_efg_pct
        home_stats['plus_minus'] if home_stats else default_values['plus_minus'],  # home_plus_minus
        away_stats['plus_minus'] if away_stats else default_values['plus_minus'],  # away_plus_minus
        home_ortg_adj_avg_pts,  # home_ortg_adj_avg_pts
        away_drtg_adj_pts_allowed,  # away_drtg_adj_pts_allowed
        home_net_rating_plusminus,  # home_net_rating_plusminus
        away_net_rating_plusminus,  # away_net_rating_plusminus
        ortg_matchup_diff,  # ortg_matchup_diff
        drtg_matchup_diff,  # drtg_matchup_diff
        net_rating_diff,  # net_rating_diff
        home_rest_days,  # home_rest_days
        home_rest_adj,  # home_rest_adj
        netrtg_last_5,  # h2h_netrtg_last_5
        netrtg_last_10,  # h2h_netrtg_last_10
        netrtg_last_20  # h2h_netrtg_last_20
    ]

if __name__ == "__main__":
    try:
        # Parse input from Next.js API
        input_data = json.loads(sys.argv[1])
        home_team_id = int(input_data["home_team_id"])
        away_team_id = int(input_data["away_team_id"])
        home_rest_days = int(input_data.get("home_rest_days", 2))
        
        # Validate input
        if home_team_id == away_team_id:
            raise ValueError("Home and away teams cannot be the same")
        if not (0 <= home_rest_days <= 7):
            raise ValueError("Rest days must be between 0-7")
        
        # Prepare features for both models
        features_model1 = prepare_features_for_model1(home_team_id, away_team_id, home_rest_days)
        features_model2 = prepare_features_for_model2(home_team_id, away_team_id, home_rest_days)
        
        # Load both models
        model1 = joblib.load('models/nba_win_predictor.joblib')
        model2 = joblib.load('models/nba_win_predictor2.joblib')
        
        # Convert features to DataFrame with proper column names
        feature_names_model1 = [
            "home_avg_pts", 
            "away_avg_pts_scored",
            "away_avg_pts_allowed", 
            "home_win_pct", 
            "home_net_rating", 
            "home_rest_days", 
        ]
        feature_names_model2 = [
            "home_avg_pts", 
            "away_avg_pts_allowed", 
            "home_off_rating", 
            "away_def_rating", 
            "home_net_rating", 
            "away_net_rating", 
            "home_pace", 
            "away_pace", 
            "home_ts_pct", 
            "away_ts_pct", 
            "home_efg_pct", 
            "away_efg_pct", 
            "home_plus_minus", 
            "away_plus_minus", 
            "home_ortg_adj_avg_pts", 
            "away_drtg_adj_pts_allowed", 
            "home_net_rating_plusminus", 
            "away_net_rating_plusminus", 
            "ortg_matchup_diff", 
            "drtg_matchup_diff", 
            "net_rating_diff", 
            "home_rest_days", 
            "home_rest_adj", 
            "h2h_netrtg_last_5", 
            "h2h_netrtg_last_10", 
            "h2h_netrtg_last_20"
        ]
        
        features_df_model1 = pd.DataFrame([features_model1], columns=feature_names_model1)
        features_df_model2 = pd.DataFrame([features_model2], columns=feature_names_model2)
        
        # Make predictions
        prob_model1 = model1.predict_proba(features_df_model1)[0][1]
        prob_model2 = model2.predict_proba(features_df_model2)[0][1]
        
        # Prepare response
        result = {
            "predictions": {
                "basic_model": {
                    "probability": prob_model1,
                    "accuracy": 0.711  # From your training
                },
                "advanced_model": {
                    "probability": prob_model2,
                    "accuracy": 0.606  # Update with actual accuracy
                }
            },
            "metadata": {
                "home_team_id": home_team_id,
                "away_team_id": away_team_id,
                "home_rest_days": home_rest_days
            }
        }
        
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "predictions": {
                "basic_model": {"probability": 0.5},
                "advanced_model": {"probability": 0.5}
            }
        }), file=sys.stderr)
        sys.exit(1)