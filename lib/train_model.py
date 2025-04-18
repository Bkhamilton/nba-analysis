import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load engineered data
df = pd.read_csv("nba_ml_ready.csv")

# Define features/target
features = ["home_avg_pts", "away_avg_pts_allowed", "home_win_pct", "home_rest_days", "head_to_head_win_pct", "head_to_head_avg_score_diff"]
X = df[features]
y = df["home_win"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, predictions):.2%}")

# Save model
import joblib
joblib.dump(model, "nba_win_predictor.joblib")