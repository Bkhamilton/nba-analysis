'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

type Team = {
  id: number;
  name: string;
  abbreviation: string;
};

type Probability = {
  basic_model: {
    probability: number;
    accuracy: number;
  };
  advanced_model: {
    probability: number;
    accuracy: number;
  };
};

export default function PredictionForm() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [homeTeamId, setHomeTeamId] = useState<number | null>(null);
  const [awayTeamId, setAwayTeamId] = useState<number | null>(null);
  const [homeRestDays, setHomeRestDays] = useState(2); // Default to 2 days rest
  const [prediction, setPrediction] = useState<Probability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch team list on mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('id, name, abbreviation')
          .order('name');
        
        if (error) throw error;
        setTeams(data || []);
      } catch (err) {
        setError('Failed to load teams');
        console.error('Error fetching teams:', err);
      }
    };
    fetchTeams();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!homeTeamId || !awayTeamId) {
      setError('Please select both teams');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeamId,
          awayTeamId,
          homeRestDays
        })
      });

      const data = await res.json();
      console.log('API Response:', data);
      
      if (!res.ok) {
        throw new Error(data.error || 'Prediction failed');
      }

      setPrediction(data.predictions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">NBA Game Predictor</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Home Team Select */}
        <div>
          <label className="block text-sm font-medium mb-1">Home Team</label>
          <select
            value={homeTeamId || ''}
            onChange={(e) => setHomeTeamId(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            required
            disabled={loading}
          >
            <option value="">Select team</option>
            {teams.map((team) => (
              <option key={`home-${team.id}`} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Away Team Select */}
        <div>
          <label className="block text-sm font-medium mb-1">Away Team</label>
          <select
            value={awayTeamId || ''}
            onChange={(e) => setAwayTeamId(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            required
            disabled={loading}
          >
            <option value="">Select team</option>
            {teams.map((team) => (
              <option key={`away-${team.id}`} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rest Days */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Home Team Rest Days (0-7)
          </label>
          <input
            type="number"
            min="0"
            max="7"
            value={homeRestDays}
            onChange={(e) => setHomeRestDays(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !homeTeamId || !awayTeamId}
          className={`w-full py-2 px-4 rounded-md ${
            loading ? 'bg-gray-600' : 'bg-[#C9082A] hover:bg-[#C9082A]/90'
          } text-white`}
        >
          {loading ? 'Predicting...' : 'Predict Winner'}
        </button>
      </form>

      {prediction && (
        <div className="mt-6 space-y-6">
          {/* Basic Model Prediction */}
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="font-bold">Basic Model Prediction</h3>
            <p className="mt-2">
              Home team win probability:{" "}
              <span className="text-[#C9082A] font-bold">
                {(prediction.basic_model.probability * 100).toFixed(1)}%
              </span>
            </p>
            <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
              <div
                className="bg-[#C9082A] h-2.5 rounded-full"
                style={{
                  width: `${prediction.basic_model.probability * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Accuracy: {(prediction.basic_model.accuracy * 100).toFixed(1)}%
            </p>
          </div>

          {/* Advanced Model Prediction */}
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="font-bold">Advanced Model Prediction</h3>
            <p className="mt-2">
              Home team win probability:{" "}
              <span className="text-[#C9082A] font-bold">
                {(prediction.advanced_model.probability * 100).toFixed(1)}%
              </span>
            </p>
            <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
              <div
                className="bg-[#C9082A] h-2.5 rounded-full"
                style={{
                  width: `${prediction.advanced_model.probability * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Accuracy: {(prediction.advanced_model.accuracy * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}