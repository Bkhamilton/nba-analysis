'use client';
import { useState } from 'react';

export default function PredictionForm() {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeRestDays, setHomeRestDays] = useState(1);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // In a real app, you'd fetch team stats from Supabase here
    const mockHomeStats = {
      avg_pts: 112.3,       // Replace with real data
      win_pct: 0.65         // Replace with real data
    };

    const mockAwayStats = {
      avg_pts_allowed: 108.7 // Replace with real data
    };

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeamStats: mockHomeStats,
          awayTeamStats: mockAwayStats,
          homeRestDays
        })
      });

      const data = await res.json();
      setPrediction(data.homeWinProbability);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">NBA Game Predictor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Home Team</label>
          <input
            type="text"
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Away Team</label>
          <input
            type="text"
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Home Team Rest Days
          </label>
          <input
            type="number"
            min="0"
            max="7"
            value={homeRestDays}
            onChange={(e) => setHomeRestDays(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md ${
            loading ? 'bg-gray-600' : 'bg-[#C9082A] hover:bg-[#C9082A]/90'
          } text-white`}
        >
          {loading ? 'Predicting...' : 'Predict Winner'}
        </button>
      </form>

      {prediction !== null && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="font-bold">Prediction Result</h3>
          <p className="mt-2">
            Home team win probability: <span className="text-[#C9082A] font-bold">{(prediction * 100).toFixed(1)}%</span>
          </p>
          <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
            <div
              className="bg-[#C9082A] h-2.5 rounded-full"
              style={{ width: `${prediction * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}