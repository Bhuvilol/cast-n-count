
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Candidate } from "@/types/voting";

interface VotingCardProps {
  candidate: Candidate;
  onVote: (candidateId: number) => Promise<void>;
  isVoting: boolean;
  isReadOnly: boolean;
  hasVoted: boolean;
}

export const VotingCard = ({ 
  candidate, 
  onVote, 
  isVoting, 
  isReadOnly,
  hasVoted 
}: VotingCardProps) => {
  return (
    <Card className="p-6 bg-opacity-10 bg-white backdrop-blur-lg rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300">
      <h3 className="text-xl font-semibold text-white mb-4">{candidate.name}</h3>
      <p className="text-gray-300 mb-4">Current Votes: {candidate.voteCount}</p>
      <Button
        onClick={() => onVote(candidate.id)}
        disabled={isVoting || hasVoted || isReadOnly}
        className="w-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isVoting ? "Confirming..." : isReadOnly ? "Connect to Vote" : "Vote"}
      </Button>
    </Card>
  );
};
