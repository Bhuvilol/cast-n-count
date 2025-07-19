import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";

const VotingStats = ({ candidates, totalVotes, votingActive }) => {
  if (!candidates || candidates.length === 0) {
    return null;
  }

  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  const getLeadingCandidate = () => {
    if (candidates.length === 0) return null;
    return candidates.reduce((leading, current) => 
      current.voteCount > leading.voteCount ? current : leading
    );
  };

  const leadingCandidate = getLeadingCandidate();

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold text-white">📊 Voting Statistics</h3>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
          votingActive 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
            : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {votingActive ? '🟢 Active' : '🔴 Inactive'}
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6 text-center">
          <div className="text-4xl font-bold text-blue-300 mb-2">{candidates.length}</div>
          <div className="text-blue-200 font-semibold">Candidates</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 text-center">
          <div className="text-4xl font-bold text-green-300 mb-2">{totalVotes}</div>
          <div className="text-green-200 font-semibold">Total Votes</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 text-center">
          <div className="text-2xl font-bold text-purple-300 mb-2">
            {leadingCandidate ? leadingCandidate.name : 'N/A'}
          </div>
          <div className="text-purple-200 font-semibold">Leading</div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="overflow-hidden rounded-2xl border border-white/20">
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-white/10 border-b border-white/20">
                <th className="text-left py-4 px-6 font-bold text-lg">Candidate</th>
                <th className="text-center py-4 px-6 font-bold text-lg">Votes</th>
                <th className="text-center py-4 px-6 font-bold text-lg">Percentage</th>
                <th className="text-center py-4 px-6 font-bold text-lg">Progress</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => {
                const percentage = calculatePercentage(candidate.voteCount);
                const isLeading = leadingCandidate && candidate.id === leadingCandidate.id;
                
                return (
                  <tr 
                    key={candidate.id} 
                    className={`border-b border-white/10 hover:bg-white/5 transition-all duration-300 ${
                      isLeading ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          isLeading 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' 
                            : 'bg-gray-600 text-gray-200'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{candidate.name}</div>
                          {isLeading && (
                            <div className="text-yellow-400 text-sm font-medium flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Leading
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="font-mono text-xl font-bold">{candidate.voteCount}</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="font-mono text-xl font-bold">{percentage}%</span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isLeading ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Stats */}
      {totalVotes > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-600/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Average votes per candidate:</span>
              <span className="text-white font-bold font-mono">
                {(totalVotes / candidates.length).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Vote difference:</span>
              <span className="text-white font-bold font-mono">
                {candidates.length > 1 
                  ? Math.abs(candidates[0].voteCount - candidates[1].voteCount)
                  : 0
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingStats; 