
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
    const init = async () => {
      try {
        // Check if wallet is already connected by requesting accounts
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            await connectWallet();
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setLoading(false);
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const { signer } = await getWeb3Provider();
      const address = await signer.getAddress();
      setAccount(address);
      console.log("Wallet connected:", address);
      await loadCandidates(signer);
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const loadCandidates = async (signer: ethers.Signer) => {
    try {
      console.log("Loading candidates...");
      const contract = getVotingContract(signer);
      
      // First check if the contract is accessible
      const count = await contract.getCandidatesCount();
      console.log("Candidate count:", count.toString());
      
      const candidatesList: Candidate[] = [];
      for (let i = 0; i < count.toNumber(); i++) {
        const candidate = await contract.getCandidate(i);
        candidatesList.push({
          id: candidate[0].toNumber(),
          name: candidate[1],
          voteCount: candidate[2].toNumber(),
        });
      }
      
      console.log("Candidates loaded:", candidatesList);
      setCandidates(candidatesList);
      
      const voted = await contract.hasVoted(await signer.getAddress());
      setHasVoted(voted);
    } catch (error) {
      console.error("Error loading candidates:", error);
      toast({
        title: "Error",
        description: "Failed to load candidates. Please check your contract address.",
        variant: "destructive",
      });
    } finally {
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
      
      await loadCandidates(signer);
    } catch (error) {
      console.error("Voting error:", error);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse text-lg text-white">Loading voting system...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Decentralized Voting</h1>
          <p className="text-gray-300 mb-4">
            {account ? (
              <>
                Connected Wallet: <span className="font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
              </>
            ) : (
              <Button 
                onClick={connectWallet} 
                className="bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Connect Wallet
              </Button>
            )}
          </p>
        </div>

        {account && !loading && (
          <div className="space-y-8">
            {hasVoted ? (
              <div className="text-center p-6 bg-opacity-20 bg-white backdrop-blur-lg rounded-xl border border-white/10">
                <h2 className="text-2xl text-white mb-4">Thank you for voting!</h2>
                <p className="text-gray-300">Your vote has been recorded on the blockchain.</p>
              </div>
            ) : candidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {candidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className="p-6 bg-opacity-10 bg-white backdrop-blur-lg rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">{candidate.name}</h3>
                    <p className="text-gray-300 mb-4">Current Votes: {candidate.voteCount}</p>
                    <Button
                      onClick={() => submitVote(candidate.id)}
                      disabled={voting || hasVoted}
                      className="w-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {voting ? "Confirming..." : "Vote"}
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-opacity-20 bg-white backdrop-blur-lg rounded-xl border border-white/10">
                <p className="text-gray-300">No candidates found. Please check the contract configuration.</p>
              </div>
            )}
          </div>
        )}

        {!account && !loading && (
          <div className="text-center p-6 bg-opacity-20 bg-white backdrop-blur-lg rounded-xl border border-white/10">
            <p className="text-gray-300">Please connect your wallet to view candidates and vote.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
