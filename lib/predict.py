import sys
import json
import joblib
import numpy as np
import pandas as pd
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

# Fetch environment variables
supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

# Validate environment variables
if not supabase_url or not supabase_key:
    raise ValueError("Supabase URL or key is missing. Check your environment variables.")

# Initialize Supabase client
supabase = create_client(supabase_url, supabase_key)

def fetch_team_stats(team_id, is_home=True):
    """Fetch team-specific stats using RPC functions"""
    try:
        func_name = 'get_home_team_stats' if is_home else 'get_away_team_stats'
        response = supabase.rpc(func_name, {'team_id': team_id}).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error fetching team stats: {str(e)}", file=sys.stderr)
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

def prepare_features(home_team_id, away_team_id, home_rest_days):
    """Compile all features in exact training order"""
    # Fetch all required data
    home_stats = fetch_team_stats(home_team_id, is_home=True)
    away_stats = fetch_team_stats(away_team_id, is_home=False)
    h2h_stats = fetch_head_to_head_stats(home_team_id, away_team_id)
    
    # Fallback values if data is missing
    default_values = {
        'avg_pts': 110.0,           # League average
        'avg_pts_allowed': 110.0,    # League average
        'win_pct': 0.5,              # Neutral win probability
        'win_pct_h2h': 0.5,          # No prior matchup assumption
        'score_diff_h2h': 0.0        # Even scoring
    }
    
    # Prepare features in EXACT same order as model training
    return [
        home_stats['avg_pts'] if home_stats else default_values['avg_pts'],
        away_stats['avg_pts_allowed'] if away_stats else default_values['avg_pts_allowed'],
        home_stats['win_pct'] if home_stats else default_values['win_pct'],
        home_rest_days,
        h2h_stats['win_pct'] if h2h_stats else default_values['win_pct_h2h'],
        h2h_stats['avg_score_diff'] if h2h_stats else default_values['score_diff_h2h']
    ]

if __name__ == "__main__":
    try:
        # Parse input from Next.js API
        input_data = json.loads(sys.argv[1])
        home_team_id = int(input_data["home_team_id"])
        away_team_id = int(input_data["away_team_id"])
        home_rest_days = int(input_data.get("home_rest_days", 2))  # Default 2 days rest
        
        # Validate input
        if home_team_id == away_team_id:
            raise ValueError("Home and away teams cannot be the same")
        if not (0 <= home_rest_days <= 7):
            raise ValueError("Rest days must be between 0-7")
        
        # Prepare features
        features = prepare_features(home_team_id, away_team_id, home_rest_days)
        
        # Convert features to a DataFrame with the correct column names
        feature_names = [
            "home_avg_pts",
            "away_avg_pts_allowed",
            "home_win_pct",
            "home_rest_days",
            "head_to_head_win_pct",
            "head_to_head_avg_score_diff"
        ]
        features_df = pd.DataFrame([features], columns=feature_names)  # Wrap features in a DataFrame
        
        # Load model and predict
        model = joblib.load('models/nba_win_predictor.joblib')
        probability = model.predict_proba(features_df)[0][1]
        
        # Output result with feature details
        result = {
            "probability": probability,
            "features": {
                "home_avg_pts": features[0],
                "away_pts_allowed": features[1],
                "home_win_pct": features[2],
                "home_rest_days": features[3],
                "h2h_win_pct": features[4],
                "h2h_score_diff": features[5]
            }
        }
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "probability": 0.5  # Fallback value
        }), file=sys.stderr)
        sys.exit(1)