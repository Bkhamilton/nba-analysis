import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
from sklearn.preprocessing import LabelEncoder
import joblib
import warnings
warnings.filterwarnings('ignore')

# Load engineered data
df = pd.read_csv("models/nba_ml_ready2.csv")

# Define features/target (same as before)
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
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2, 
    random_state=42,
    stratify=y  # Maintain class balance
)

# Basic XGBoost model with reasonable defaults
model = xgb.XGBClassifier(
    objective='binary:logistic',
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    gamma=0.1,
    reg_alpha=0.1,
    reg_lambda=1.0,
    random_state=42,
    eval_metric='logloss',
    early_stopping_rounds=20,
    use_label_encoder=False
)

# Fit with early stopping
model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=True
)

# Feature importance
print("\nFeature Importances:")
importance = pd.DataFrame({
    'feature': features,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)
print(importance)

# Evaluation
print("\nEvaluation Metrics:")
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

print(f"Accuracy: {accuracy_score(y_test, y_pred):.2%}")
print(f"ROC AUC: {roc_auc_score(y_test, y_pred_proba):.2%}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save model
joblib.dump(model, "models/nba_xgboost_win_predictor.joblib")
print("\nModel saved to models/nba_xgboost_win_predictor.joblib")

# Optional: Save feature importance plot
import matplotlib.pyplot as plt
xgb.plot_importance(model, max_num_features=15)
plt.tight_layout()
plt.savefig('models/feature_importance.png')
plt.close()