import os
from dotenv import load_dotenv
import requests
import pandas as pd
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL or Key is missing. Check your environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://www.nba.com/"
}

def fetch_nba_schedule(year=2024):
    url = f"https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/{year}/league/00_full_schedule.json"
    response = requests.get(url, headers=HEADERS)
    return response.json()

def parse_schedule(raw_json, season):
    games = []
    season_start_date = f"{season}-10-24"  # Hardcoded season start
    
    for month in raw_json["lscd"]:
        for game in month["mscd"]["g"]:
            game_date = game["gcode"].split("/")[0]  # Extract date (YYYYMMDD)
            
            # Skip if before season start or preseason game
            if (pd.to_datetime(game_date) < pd.to_datetime(season_start_date)) or \
               ("P" in game.get("gcode", "")):
                continue
                
            games.append({
                "game_id": game["gid"],
                "date": f"{game_date[:4]}-{game_date[4:6]}-{game_date[6:8]}",  # Format as YYYY-MM-DD
                "home_team": game["h"]["ta"],
                "away_team": game["v"]["ta"],
                "home_score": game["h"].get("s", None),
                "away_score": game["v"].get("s", None),
                "season_type": "Preseason" if "P" in game.get("gcode", "") else "Regular Season"
            })
    
    return pd.DataFrame(games)

def get_team_ids():
    """Fetch team abbreviations and IDs from the Supabase 'teams' table."""
    response = supabase.table("teams").select("id, abbreviation").execute()

    # Check if the response contains data
    if not response.data:
        raise Exception(f"Error fetching teams: {response}")

    # Return a dictionary mapping abbreviations to IDs
    return {team["abbreviation"]: team["id"] for team in response.data}

def insert_games_to_db(games_df, team_ids, season):
    """Insert games into the Supabase 'games' table."""
    season_start = pd.to_datetime(f"{season}-10-24")
    for _, game in games_df.iterrows():
        game_date = pd.to_datetime(game["date"])
        if game_date < season_start:
            print(f"Skipping preseason game {game['game_id']} on {game['date']}")
            continue

        home_team_id = team_ids.get(game["home_team"])
        away_team_id = team_ids.get(game["away_team"])

        if not home_team_id or not away_team_id:
            print(f"Skipping game {game['game_id']} due to missing team ID.")
            print(f"Home team: {game['home_team']} (ID: {home_team_id}), Away team: {game['away_team']} (ID: {away_team_id})")
            continue

        # Ensure scores are integers or None
        home_score = int(game["home_score"]) if pd.notna(game["home_score"]) else None
        away_score = int(game["away_score"]) if pd.notna(game["away_score"]) else None

        home_win = None
        if home_score is not None and away_score is not None:
            home_win = home_score > away_score

        # Insert game into the database
        try:
            response = supabase.table("games").insert({
                "season": season,
                "date": game["date"],
                "home_team_id": home_team_id,
                "away_team_id": away_team_id,
                "home_score": home_score,
                "away_score": away_score,
                "home_win": home_win
            }).execute()

            # Check if the insertion was successful
            if not response.data:
                print(f"Error inserting game {game['game_id']}: {response}")
            else:
                print(f"Inserted game {game['game_id']} successfully.")

        except Exception as e:
            print(f"Error inserting game {game['game_id']}: {e}")

# Main execution
if __name__ == "__main__":
    season = 2024
    schedule = fetch_nba_schedule(season)
    games_df = parse_schedule(schedule, season)

    # Fetch team IDs from the database
    team_ids = get_team_ids()

    # Insert games into the database
    insert_games_to_db(games_df, team_ids, season)