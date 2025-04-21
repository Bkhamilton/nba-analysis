from nba_api.stats.endpoints import LeagueDashTeamStats

# Fetch advanced stats for the 2023-24 regular season
advanced_stats = LeagueDashTeamStats(
    season="2023-24",  # Specify the season
    season_type_all_star="Regular Season",  # Regular Season or Playoffs
    measure_type_detailed_defense="Advanced",  # Use "Advanced" for advanced stats
    per_mode_detailed="Per100Possessions"  # Normalize stats per 100 possessions
).get_data_frames()[0]  # Get the first DataFrame from the response

# Display the first few rows of the DataFrame
print(advanced_stats[['TEAM_NAME', 'OFF_RATING', 'DEF_RATING', 'NET_RATING']])