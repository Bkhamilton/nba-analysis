import requests
import pandas as pd

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://www.nba.com/"
}

def fetch_nba_schedule(year=2024):
    url = f"https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/{year}/league/00_full_schedule.json"
    response = requests.get(url, headers=HEADERS)
    return response.json()

def parse_schedule(raw_json):
    games = []
    for month in raw_json["lscd"]:
        for game in month["mscd"]["g"]:
            games.append({
                "game_id": game["gid"],
                "date": game["gcode"].split("/")[0],
                "home_team": game["h"]["ta"],
                "away_team": game["v"]["ta"],
                "home_score": game["h"].get("s", None),
                "away_score": game["v"].get("s", None)
            })
    return pd.DataFrame(games)

# Usage
schedule = fetch_nba_schedule()
df = parse_schedule(schedule)
print(df.head())