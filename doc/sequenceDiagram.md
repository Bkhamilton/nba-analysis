sequenceDiagram
Frontend->>API: POST { homeTeamId, awayTeamId, homeRestDays }
API->>Supabase: Fetch team stats
Supabase-->>API: Return avg_pts, win_pct, etc.
API->>Python: Call predict.py with features
Python->>ML Model: Get prediction
ML Model-->>Python: 0.723 (72.3% home win)
Python-->>API: Return probability
API-->>Frontend: Show prediction
