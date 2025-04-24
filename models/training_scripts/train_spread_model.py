import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
from datetime import datetime

def train_spread_model():
    # Load engineered data
    df = pd.read_csv("models/nba_ml_ready_with_spread.csv")
    
    # Ensure the date column is in datetime format
    df['date'] = pd.to_datetime(df['date'])
    
    # Define spread-specific features
    features = [
        # Core metrics
        'home_avg_margin',
        'away_avg_margin',
        'home_net_rating',
        
        # Volatility
        'home_margin_std',
        'away_margin_std',
        
        # Pace adjustments
        'pace_diff',
        'home_pace',
        'away_pace',
        
        # Situational
        'rest_adjusted_spread',
        'h2h_avg_spread',
        
        # Complementary features from win model
        'home_avg_pts',
        'away_avg_pts_allowed'
    ]
    
    # Target is the actual point spread
    X = df[features]
    y = df['point_spread']
    
    # Time-based split (better than random for sports)
    test_cutoff = df['date'].max() - pd.Timedelta(days=180)  # Last 6 months as test
    train_mask = df['date'] < test_cutoff
    
    X_train, X_test = X[train_mask], X[~train_mask]
    y_train, y_test = y[train_mask], y[~train_mask]
    
    # Train model with hyperparameters tuned for spread prediction
    model = GradientBoostingRegressor(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=4,
        min_samples_leaf=5,
        subsample=0.8,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    print(f"Model Performance:")
    print(f"- MAE: {mae:.2f} points")
    print(f"- R²: {r2:.2f}")
    print(f"- Test Period: {test_cutoff.date()} to {df['date'].max().date()}")
    
    # Feature importance
    print("\nFeature Importances:")
    importance = pd.DataFrame({
        'feature': features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    print(importance)
    
    # Save model
    joblib.dump(model, "models/spread_predictor.joblib")
    print("\nModel saved to models/spread_predictor.joblib")
    
    # Optional: Save sample predictions for analysis
    test_results = X_test.copy()
    test_results['date'] = df.loc[~train_mask, 'date'].values  # Add the date column
    test_results['actual'] = y_test
    test_results['predicted'] = predictions
    test_results[['date', 'actual', 'predicted']].to_csv("models/spread_test_results.csv", index=False)

if __name__ == "__main__":
    train_spread_model()