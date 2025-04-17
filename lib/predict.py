import sys
import json
import joblib
import numpy as np

# Load model and process input
def predict(features):
    model = joblib.load('nba_win_predictor.joblib')
    features_array = np.array(features).reshape(1, -1)
    proba = model.predict_proba(features_array)
    return proba[0][1]  # Probability of home win (class 1)

if __name__ == "__main__":
    features = json.loads(sys.argv[1])
    print(predict(features))