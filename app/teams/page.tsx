export default function TeamsPage() {
    return (
        <div className="min-h-screen bg-[#0E1C36] text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">Team Analytics</h1>
            
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Team Power Rankings */}
                    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-[#C9082A]">Power Rankings</h2>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                                    <span className="w-8 h-8 bg-[#C9082A] rounded-full flex items-center justify-center mr-4">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h3 className="font-bold">Boston Celtics</h3>
                                        <p className="text-sm text-gray-400">Off Rtg: 118.3 | Def Rtg: 110.2</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
        
                    {/* Team Comparison Tool */}
                    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-[#C9082A]">Compare Teams</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <select className="bg-gray-700 p-2 rounded">
                                <option>Select Team 1</option>
                            </select>
                            <select className="bg-gray-700 p-2 rounded">
                                <option>Select Team 2</option>
                            </select>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg">
                            {/* Comparison metrics would go here */}
                            <p className="text-center text-gray-400">Select teams to compare stats</p>
                        </div>
                    </div>
                </div>
        
                {/* Full Team Stats Table */}
                <div className="mt-12 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-4 text-[#C9082A]">Season Statistics</h2>
                    <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="text-left border-b border-gray-700">
                            <th className="pb-2">Team</th>
                            <th className="pb-2">W-L</th>
                            <th className="pb-2">ORTG</th>
                            <th className="pb-2">DRTG</th>
                            <th className="pb-2">Pace</th>
                        </tr>
                        </thead>
                        <tbody>
                            {[...Array(8)].map((_, i) => (
                                <tr key={i} className="border-b border-gray-700/50">
                                <td className="py-3">Team {i + 1}</td>
                                    <td>42-20</td>
                                    <td>116.7</td>
                                    <td>110.3</td>
                                    <td>98.2</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    );
}