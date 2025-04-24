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
                <li>• Advanced Stats APIs (New)</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Data Points Collected</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 5,000+ historical games (Updated)</li>
                <li>• Team offensive/defensive stats</li>
                <li>• Advanced metrics (Net Rating, eFG%)</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Data Cleaning</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Excluded preseason games</li>
                <li>• Advanced missing value imputation</li>
                <li>• Temporal validation splits</li>
              </ul>
            </div>
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
                  <span className="font-medium text-white">Net Rating:</span> 
                  <span> Team efficiency (42.7% importance)</span>
                </li>
                <li>
                  <span className="font-medium text-white">Scoring Defense:</span> 
                  <span> Away pts allowed (19.1%)</span>
                </li>
                <li>
                  <span className="font-medium text-white">Offensive Efficiency:</span> 
                  <span> Away scoring (14.8%)</span>
                </li>
                <li>
                  <span className="font-medium text-white">Win Percentage:</span> 
                  <span> 82-game rolling (10.8%)</span>
                </li>
                <li>
                  <span className="font-medium text-white">Rest-Adjusted Pace:</span> 
                  <span> Days off × tempo (4.1%)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Technical Implementation</h3>
              <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm">
                {`# Updated Feature Engineering
def engineer_features(df):
    # Net Rating Ratio (Key Improvement)
    df['home_net_rating'] = (
        df.groupby('home_team_id')['home_score']
        .rolling(10).mean() / 
        df.groupby('home_team_id')['away_score']
        .rolling(10).mean()
    )
    
    # Defense-Adjusted Scoring
    df['away_pts_allowed_adj'] = (
        df['away_avg_pts_allowed'] * 
        (df['away_def_rating'] / league_avg)
    )`}
              </pre>
            </div>
          </div>
        </section>

        {/* Model Architecture Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-[#C9082A] border-b border-gray-700 pb-2">
            3. Machine Learning Models
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Premium Model (XGBoost)</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <span className="font-medium text-white">Algorithm:</span> 
                  <span> XGBoost Classifier</span>
                </li>
                <li>
                  <span className="font-medium text-white">Accuracy:</span> 
                  <span> 71.67% (Updated)</span>
                </li>
                <li>
                  <span className="font-medium text-white">ROC AUC:</span> 
                  <span> 77.8% (Excellent Calibration)</span>
                </li>
                <li>
                  <span className="font-medium text-white">Key Advantage:</span> 
                  <span> Handles feature interactions better</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-3">Free Model (Random Forest)</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <span className="font-medium text-white">Algorithm:</span> 
                  <span> Random Forest</span>
                </li>
                <li>
                  <span className="font-medium text-white">Accuracy:</span> 
                  <span> 68.2%</span>
                </li>
                <li>
                  <span className="font-medium text-white">Features:</span> 
                  <span> 5 core stats</span>
                </li>
                <li>
                  <span className="font-medium text-white">Latency:</span> 
                  <span> 23ms faster predictions</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Feature Importance (Premium Model)</h3>
            <div className="space-y-4">
              {[
                { name: 'Home Net Rating', value: 42.7 },
                { name: 'Away Defense', value: 19.1 },
                { name: 'Away Scoring', value: 14.8 },
                { name: 'Home Win %', value: 10.8 },
                { name: 'Rest Days', value: 4.1 }
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between mb-1">
                    <span>{item.name}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-[#C9082A] h-2.5 rounded-full" 
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Architecture Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-[#C9082A] border-b border-gray-700 pb-2">
            4. System Architecture
          </h2>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-8">
            <h3 className="text-xl font-bold mb-4">Tiered Prediction Flow</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-[#C9082A] rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold">User Request</h4>
                  <p className="text-gray-300">
                    App detects subscription tier and routes to appropriate model endpoint.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#C9082A] rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold">Model Serving</h4>
                  <p className="text-gray-300">
                    Premium: XGBoost with 26 features. Free: RandomForest with 7 features.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#C9082A] rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold">Result Delivery</h4>
                  <p className="text-gray-300">
                    Premium gets detailed breakdowns, free gets basic win probability.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Enhanced Technologies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['XGBoost', 'Next.js API Routes', 'Supabase', 'Python', 'Joblib', 'Vercel Edge', 'Pandas', 'Scikit-learn'].map((tech) => (
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