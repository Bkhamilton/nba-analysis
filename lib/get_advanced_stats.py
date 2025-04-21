import pandas as pd
from nba_api.stats.endpoints import TeamDashboardByGeneralSplits, LeagueDashTeamStats
from nba_api.stats.static import teams
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_team_id_mapping():
    """Map NBA API team IDs to our Supabase team IDs"""
    response = supabase.table("teams").select("id, name, abbreviation").execute()
    teams_data = response.data
    
    nba_teams = teams.get_teams()
    team_map = {}
    
    for nba_team in nba_teams:
        # Try to match by abbreviation first
        supabase_team = next(
            (t for t in teams_data if t['abbreviation'] == nba_team['abbreviation']),
            None
        )
        
        # If no match by abbreviation, try by name
        if not supabase_team:
            supabase_team = next(
                (t for t in teams_data if t['name'].lower() == nba_team['full_name'].lower()),
                None
            )
        
        if supabase_team:
            team_map[nba_team['id']] = supabase_team['id']
        else:
            print(f"Warning: Could not match NBA team {nba_team['full_name']} ({nba_team['abbreviation']})")
    
    return team_map

def calculate_advanced_stats(row):
    """Calculate advanced metrics from basic stats"""
    # Calculate True Shooting Percentage (TS%)
    ts_pct = row['PTS'] / (2 * (row['FGA'] + 0.44 * row['FTA'])) if (row['FGA'] + row['FTA']) > 0 else 0
    
    # Calculate Effective Field Goal Percentage (eFG%)
    efg_pct = (row['FGM'] + 0.5 * row['FG3M']) / row['FGA'] if row['FGA'] > 0 else 0
    
    # Calculate Assist Ratio
    ast_ratio = row['AST'] / row['FGM'] if row['FGM'] > 0 else 0
    
    # Calculate Turnover Percentage
    tov_pct = row['TOV'] / (row['FGA'] + 0.44 * row['FTA'] + row['TOV']) if (row['FGA'] + row['FTA'] + row['TOV']) > 0 else 0
    
    return {
        'ts_pct': ts_pct,
        'efg_pct': efg_pct,
        'ast_ratio': ast_ratio,
        'tov_pct': tov_pct
    }

def fetch_and_store_team_stats():
    team_map = get_team_id_mapping()
    seasons = [2024, 2023, 2022, 2021, 2020]

    for season in seasons:
        season_str = f"{season}-{str(season+1)[-2:]}"
        print(f"\nProcessing season: {season_str}")
        
        # Fetch advanced stats from LeagueDashTeamStats
        try:
            print("Fetching league-wide advanced stats...")
            advanced_stats = LeagueDashTeamStats(
                season=season_str,
                season_type_all_star="Regular Season",
                measure_type_detailed_defense="Advanced",  # Fetch advanced metrics
                per_mode_detailed="Per100Possessions"  # Normalize stats per 100 possessions
            ).get_data_frames()[0]
            
            # Fetch basic stats from TeamDashboardByGeneralSplits
            nba_teams = teams.get_teams()
            
            for team in nba_teams:
                team_id = team['id']
                team_name = team['full_name']
                
                if team_id not in team_map:
                    print(f"Skipping unmapped team: {team_name}")
                    continue
                
                try:
                    print(f"Processing {team_name}...")
                    
                    # Get team dashboard data
                    dashboard = TeamDashboardByGeneralSplits(
                        team_id=team_id,
                        season=season_str,
                        season_type_all_star="Regular Season"
                    )
                    team_stats = dashboard.get_data_frames()[0].iloc[0]
                    
                    # Get advanced stats for this team from league data
                    team_advanced = advanced_stats[advanced_stats['TEAM_ID'] == team_id].iloc[0]
                    
                    # Calculate additional metrics
                    calculated_stats = calculate_advanced_stats(team_stats)
                    
                    # Prepare data for Supabase
                    data = {
                        'team_id': team_map[team_id],
                        'season': season,
                        # From LeagueDashTeamStats
                        'off_rating': team_advanced.get('OFF_RATING'),
                        'def_rating': team_advanced.get('DEF_RATING'),
                        'net_rating': team_advanced.get('NET_RATING'),
                        'pace': team_advanced.get('PACE'),
                        # Calculated metrics
                        'ts_pct': calculated_stats['ts_pct'],
                        'efg_pct': calculated_stats['efg_pct'],
                        'ast_ratio': calculated_stats['ast_ratio'],
                        'tov_pct': calculated_stats['tov_pct'],
                        # From TeamDashboard
                        'oreb_pct': team_stats['OREB'] / (team_stats['OREB'] + team_stats['DREB']) if (team_stats['OREB'] + team_stats['DREB']) > 0 else 0,
                        'dreb_pct': team_stats['DREB'] / (team_stats['OREB'] + team_stats['DREB']) if (team_stats['OREB'] + team_stats['DREB']) > 0 else 0,
                        # Additional valuable metrics
                        'win_pct': team_stats['W_PCT'],
                        'plus_minus': team_stats['PLUS_MINUS'],
                        'fg_pct': team_stats['FG_PCT'],
                        'fg3_pct': team_stats['FG3_PCT'],
                        'ft_pct': team_stats['FT_PCT'],
                        'ast_to_tov': team_stats['AST'] / team_stats['TOV'] if team_stats['TOV'] > 0 else 0,
                        'stl_pct': team_stats['STL'] / team_stats['MIN'] * 100 if team_stats['MIN'] > 0 else 0,
                        'blk_pct': team_stats['BLK'] / team_stats['MIN'] * 100 if team_stats['MIN'] > 0 else 0
                    }
                    
                    # Insert into Supabase
                    supabase.table("team_advanced_stats").insert(data).execute()
                    print(f"Inserted data for {team_name}")
                    
                    time.sleep(0.5)  # Rate limiting
                    
                except Exception as e:
                    print(f"Error processing {team_name}: {str(e)}")
                    continue
                    
        except Exception as e:
            print(f"Error fetching league data for season {season_str}: {str(e)}")
            continue

if __name__ == "__main__":
    fetch_and_store_team_stats()