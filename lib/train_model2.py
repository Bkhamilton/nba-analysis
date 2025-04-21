import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load engineered data
df = pd.read_csv("models/nba_ml_ready2.csv")

# Define features/target
features = [
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
X = df[features]
y = df["home_win"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Log feature importance
print("Feature Importances:")
for feature, importance in zip(features, model.feature_importances_):
    print(f"{feature}: {importance:.4f}")

# Evaluate
predictions = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, predictions):.2%}")

# Save model
import joblib
joblib.dump(model, "models/nba_win_predictor2.joblib")