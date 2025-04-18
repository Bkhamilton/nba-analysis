export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#0E1C36] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How Our <span className="text-[#C9082A]">NBA Predictions</span> Work
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A data-driven approach combining machine learning with basketball analytics
          </p>
        </div>

        {/* Data Pipeline Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-[#C9082A] border-b border-gray-700 pb-2">
            1. Data Collection & Processing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Data Sources</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Official NBA API</li>
                <li>• Basketball-Reference</li>
                <li>• Custom Supabase Database</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Data Points Collected</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 2,100+ historical games</li>
                <li>• Team offensive/defensive stats</li>
                <li>• Player performance metrics</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Data Cleaning</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Excluded preseason games</li>
                <li>• Handled missing values</li>
                <li>• Validated score integrity</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-3">Database Schema</h3>
            <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm">
              {`// Supabase Tables
games {
  id: number
  date: date
  home_team_id: number (foreign key)
  away_team_id: number (foreign key)
  home_score: number
  away_score: number
  home_win: boolean
  season_type: 'Preseason' | 'Regular Season' | 'Playoffs'
}

teams {
  id: number
  name: string
  abbreviation: string
  conference: string
}`}
            </pre>
          </div>
        </section>

        {/* Feature Engineering Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-[#C9082A] border-b border-gray-700 pb-2">
            2. Feature Engineering
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Key Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <span className="font-medium text-white">Home Team Avg Points:</span> 
                  <span> 10-game rolling average</span>
                </li>
                <li>
                  <span className="font-medium text-white">Away Team Defense:</span> 
                  <span> Points allowed in last 10 games</span>
                </li>
                <li>
                  <span className="font-medium text-white">Win Percentage:</span> 
                  <span> Home team's last 40 games</span>
                </li>
                <li>
                  <span className="font-medium text-white">Head-to-Head:</span> 
                  <span> Last 10 matchups between teams</span>
                </li>
                <li>
                  <span className="font-medium text-white">Rest Days:</span> 
                  <span> Days since home team's last game</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Technical Implementation</h3>
              <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm">
                {`# Python Feature Engineering Example
def engineer_features(df):
    # Rolling averages
    df['home_avg_pts'] = df.groupby('home_team_id')['home_score']
                          .transform(lambda x: x.rolling(10).mean())
    
    # Head-to-head stats
    df['h2h_win_pct'] = df.groupby(['home_team_id','away_team_id'])['home_win']
                         .transform(lambda x: x.shift().rolling(10).mean())
    
    # Rest days calculation
    df['home_rest_days'] = df.groupby('home_team_id')['date']
                            .diff().dt.days.fillna(7)`}
              </pre>
            </div>
          </div>
        </section>

        {/* Model Architecture Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-[#C9082A] border-b border-gray-700 pb-2">
            3. Machine Learning Model
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Model Specifications</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <span className="font-medium text-white">Algorithm:</span> 
                  <span> Random Forest Classifier</span>
                </li>
                <li>
                  <span className="font-medium text-white">Accuracy:</span> 
                  <span> 66.7% (baseline: 50%)</span>
                </li>
                <li>
                  <span className="font-medium text-white">Training Data:</span> 
                  <span> 2018-2023 regular season games</span>
                </li>
                <li>
                  <span className="font-medium text-white">Test Split:</span> 
                  <span> 20% holdout for validation</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Feature Importance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Home Team Offense</span>
                    <span>32%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-[#C9082A] h-2.5 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Away Team Defense</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-[#C9082A] h-2.5 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Head-to-Head History</span>
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-[#C9082A] h-2.5 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* System Architecture Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-[#C9082A] border-b border-gray-700 pb-2">
            4. System Architecture
          </h2>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-8">
            <h3 className="text-xl font-bold mb-4">Full Stack Flow</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-[#C9082A] rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold">Frontend (Next.js)</h4>
                  <p className="text-gray-300">
                    User selects teams, which triggers a POST request to our API route with team IDs and rest days.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#C9082A] rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold">Backend API (Next.js Route)</h4>
                  <p className="text-gray-300">
                    Processes request, calls Python prediction script with team data, and returns the probability.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#C9082A] rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold">Python Prediction Script</h4>
                  <p className="text-gray-300">
                    Loads the trained model, calculates features from Supabase data, and returns win probability.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Next.js', 'Supabase', 'Python', 'scikit-learn', 'Pandas', 'Tailwind CSS', 'Vercel', 'Joblib'].map((tech) => (
                <div key={tech} className="bg-gray-900/50 px-4 py-2 rounded-md text-center">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}