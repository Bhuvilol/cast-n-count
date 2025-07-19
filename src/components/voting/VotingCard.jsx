import { Button } from "@/components/ui/button.jsx";

export const VotingCard = ({ 
  candidate, 
  onVote, 
  isVoting, 
  isReadOnly,
  hasVoted 
}) => {
  const getVoteButtonText = () => {
    if (isVoting) return "Confirming Vote...";
    if (hasVoted) return "Already Voted";
    if (isReadOnly) return "Connect Wallet to Vote";
    return `Vote for ${candidate.name}`;
  };

  const getVoteButtonColor = () => {
    if (hasVoted) return "bg-gray-600 text-gray-300";
    if (isReadOnly) return "bg-blue-600 text-white hover:bg-blue-700";
    return "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700";
  };

  const getAvatarColor = (name) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-pink-500 to-rose-500'
    ];
    return colors[name.length % colors.length];
  };

  return (
    <div className="group relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
      
      <div className="relative z-10 text-center">
        {/* Candidate Avatar */}
        <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${getAvatarColor(candidate.name)} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {candidate.name.charAt(0)}
        </div>
        
        {/* Candidate Name */}
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
          {candidate.name}
        </h3>
        
        {/* Vote Count */}
        <div className="mb-6">
          <div className="text-4xl font-bold text-purple-300 mb-1">{candidate.voteCount}</div>
          <div className="text-gray-400 text-sm font-medium">votes</div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, (candidate.voteCount / Math.max(1, candidate.voteCount)) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Status Indicators */}
        {hasVoted && (
          <div className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-2xl">
            <div className="text-green-400 text-sm font-medium flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You voted for this candidate
            </div>
          </div>
        )}
        
        {isReadOnly && (
          <div className="mb-6 p-3 bg-blue-500/20 border border-blue-500/30 rounded-2xl">
            <div className="text-blue-400 text-sm font-medium flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Connect wallet to vote
            </div>
          </div>
        )}
        
        {/* Vote Button */}
        <Button
          onClick={() => onVote(candidate.id)}
          disabled={isVoting || hasVoted || isReadOnly}
          className={`w-full ${getVoteButtonColor()} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 rounded-2xl font-semibold text-lg py-4`}
        >
          {isVoting && (
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Confirming...</span>
            </div>
          )}
          {!isVoting && getVoteButtonText()}
        </Button>
      </div>
    </div>
  );
}; 