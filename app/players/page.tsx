export default function PlayersPage() {
    return (
      <div className="min-h-screen bg-[#0E1C36] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Player Impact Analysis</h1>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Top Performers */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-[#C9082A]">Top Scorers</h2>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700 mr-3"></div>
                    <div>
                      <h3 className="font-bold">Luka Dončić</h3>
                      <p className="text-sm text-gray-400">34.2 PPG | 8.9 AST</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Player Search */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-[#C9082A]">Find Players</h2>
              <input 
                type="text" 
                placeholder="Search players..." 
                className="w-full bg-gray-700 p-2 rounded mb-4"
              />
              <div className="h-64 overflow-y-auto">
                {/* Search results would go here */}
                <p className="text-center text-gray-400 py-8">Search for players to view stats</p>
              </div>
            </div>
  
            {/* Advanced Metrics */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-[#C9082A]">Advanced Metrics</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Player Efficiency Rating (PER)</h3>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-[#C9082A] h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Win Shares</h3>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-[#C9082A] h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                {/* Add more metrics */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }