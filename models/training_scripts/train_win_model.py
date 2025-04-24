import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

# Load engineered data
df = pd.read_csv("models/nba_ml_ready.csv")

# Define features/target
features = [
    "home_avg_pts", 
    "away_avg_pts_scored",
    "away_avg_pts_allowed", 
    "home_win_pct", 
    "home_net_rating", 
    "home_rest_days", 
]
X = df[features]
y = df["home_win"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
hyperparameters = {
    "n_estimators": 196,
    "max_depth": 22,
    "min_samples_split": 15,
    "min_samples_leaf": 7,
    "max_features": None,
    "random_state": 42
}
model = RandomForestClassifier(**hyperparameters)
model.fit(X_train, y_train)

# Log feature importance
print("Feature Importances:")
for feature, importance in zip(features, model.feature_importances_):
    print(f"{feature}: {importance:.4f}")

# Evaluate
predictions = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, predictions):.2%}")

# Add after your accuracy print:
print("\nClassification Report:")
print(classification_report(y_test, predictions))

print(f"\nROC AUC: {roc_auc_score(y_test, model.predict_proba(X_test)[:,1]):.2%}")

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))

# Save model
import joblib
joblib.dump(model, "models/nba_win_predictor.joblib")

# Visualize feature importance
import matplotlib.pyplot as plt

plt.figure(figsize=(10,6))
plt.barh(features, model.feature_importances_)
plt.title("Feature Importance")
plt.tight_layout()
plt.savefig('models/results/feature_importance.png')
plt.close()

# Save evaluation metrics to file
with open("models/results/evaluation_metrics.txt", "w") as f:
    f.write(f"Accuracy: {accuracy_score(y_test, predictions):.2%}\n")
    f.write("\nClassification Report:\n")
    f.write(classification_report(y_test, predictions))
    f.write(f"\nROC AUC: {roc_auc_score(y_test, model.predict_proba(X_test)[:,1]):.2%}")