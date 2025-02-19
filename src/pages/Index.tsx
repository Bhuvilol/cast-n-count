
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getWeb3Provider, getVotingContract } from '../utils/web3Config';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

const Index = () => {
  const [account, setAccount] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      const { signer } = await getWeb3Provider();
      const address = await signer.getAddress();
      setAccount(address);
      await loadCandidates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadCandidates = async () => {
    try {
      const { signer } = await getWeb3Provider();
      const contract = getVotingContract(signer);
      const count = await contract.getCandidatesCount();
      
      const candidatesList: Candidate[] = [];
      for (let i = 0; i < count.toNumber(); i++) {
        const candidate = await contract.getCandidate(i);
        candidatesList.push({
          id: candidate[0].toNumber(),
          name: candidate[1],
          voteCount: candidate[2].toNumber(),
        });
      }
      
      setCandidates(candidatesList);
      const voted = await contract.hasVoted(await signer.getAddress());
      setHasVoted(voted);
      setLoading(false);
    } catch (error) {
      console.error("Error loading candidates:", error);
      setLoading(false);
    }
  };

  const submitVote = async (candidateId: number) => {
    try {
      setVoting(true);
      const { signer } = await getWeb3Provider();
      const contract = getVotingContract(signer);
      
      const tx = await contract.vote(candidateId);
      await tx.wait();
      
      toast({
        title: "Success!",
        description: "Your vote has been recorded on the blockchain.",
      });
      
      await loadCandidates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading voting system...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">Decentralized Voting</h1>
          <p className="text-gray-300">
            {account ? (
              `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
            ) : (
              <Button onClick={connectWallet} className="bg-vote-mint text-gray-900 hover:bg-vote-mint/90">
                Connect Wallet
              </Button>
            )}
          </p>
        </div>

        {hasVoted ? (
          <div className="text-center p-6 bg-glass-background border border-glass-border rounded-lg backdrop-blur-sm animate-fade-in">
            <h2 className="text-2xl text-white mb-4">Thank you for voting!</h2>
            <p className="text-gray-300">Your vote has been recorded on the blockchain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <Card
                key={candidate.id}
                className="p-6 bg-glass-background border border-glass-border backdrop-blur-sm transform transition-all duration-300 hover:scale-105 animate-fade-in"
              >
                <h3 className="text-xl font-semibold text-white mb-4">{candidate.name}</h3>
                <p className="text-gray-300 mb-4">Current Votes: {candidate.voteCount}</p>
                <Button
                  onClick={() => submitVote(candidate.id)}
                  disabled={voting || hasVoted}
                  className="w-full bg-vote-mint text-gray-900 hover:bg-vote-mint/90 disabled:opacity-50"
                >
                  {voting ? "Voting..." : "Vote"}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
