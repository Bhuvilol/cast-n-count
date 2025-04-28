import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getWeb3Provider, getVotingContract, CONTRACT_ADDRESS } from '../utils/web3Config';
import { deployVotingContract } from '../utils/deployContract';
import { toast } from "@/components/ui/use-toast";
import { VotingCard } from '@/components/voting/VotingCard';
import { WalletConnect } from '@/components/voting/WalletConnect';
import { DeployContract } from '@/components/voting/DeployContract';
import { Candidate } from '@/types/voting';

const Index = () => {
  const [account, setAccount] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [contractAddress, setContractAddress] = useState(CONTRACT_ADDRESS);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            await connectWallet();
          } else {
            await loadInReadOnlyMode();
          }
        } else {
          await loadInReadOnlyMode();
        }
      } catch (error) {
        console.error("Initialization error:", error);
        await loadInReadOnlyMode();
      }
    };

    init();
  }, [contractAddress]);

  const loadInReadOnlyMode = async () => {
    try {
      const { provider, isReadOnly } = await getWeb3Provider();
      setIsReadOnly(isReadOnly);
      await loadCandidates(provider);
      setLoading(false);
    } catch (error) {
      console.error("Read-only mode error:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load voting data. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      const { signer, isReadOnly } = await getWeb3Provider();
      setIsReadOnly(isReadOnly);
      
      if (signer) {
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Wallet connected:", address);
        await loadCandidates(signer);
      } else {
        await loadInReadOnlyMode();
        toast({
          title: "Read-Only Mode",
          description: "Viewing in read-only mode. Connect wallet to vote.",
        });
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      await loadInReadOnlyMode();
    }
  };

  const loadCandidates = async (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
    try {
      console.log("Loading candidates from address:", contractAddress);
      const contract = new ethers.Contract(contractAddress, getVotingContract(signerOrProvider).interface, signerOrProvider);
      
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
      
      if (!isReadOnly && signerOrProvider instanceof ethers.Signer) {
        const address = await signerOrProvider.getAddress();
        const voted = await contract.hasVoted(address);
        setHasVoted(voted);
      }
    } catch (error) {
      console.error("Error loading candidates:", error);
      toast({
        title: "Error",
        description: "Failed to load candidates. Please check your contract address or deploy a new contract.",
        variant: "destructive",
      });
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async (candidateId: number) => {
    try {
      setVoting(true);
      const { signer } = await getWeb3Provider();
      
      if (!signer) {
        toast({
          title: "Error",
          description: "Please connect your wallet to vote.",
          variant: "destructive",
        });
        setVoting(false);
        return;
      }
      
      const contract = new ethers.Contract(contractAddress, getVotingContract(signer).interface, signer);
      
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

  const handleDeploy = async () => {
    try {
      setDeploying(true);
      const newContractAddress = await deployVotingContract();
      
      toast({
        title: "Contract Deployed!",
        description: `New contract deployed at: ${newContractAddress}`,
      });
      
      setContractAddress(newContractAddress);
    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy contract. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setDeploying(false);
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
        <WalletConnect 
          account={account}
          onConnect={connectWallet}
          isReadOnly={isReadOnly}
        />
        
        <DeployContract 
          account={account}
          contractAddress={contractAddress}
          defaultContractAddress={CONTRACT_ADDRESS}
          onDeploy={handleDeploy}
          deploying={deploying}
        />

        <div className="space-y-8">
          {hasVoted ? (
            <div className="text-center p-6 bg-opacity-20 bg-white backdrop-blur-lg rounded-xl border border-white/10">
              <h2 className="text-2xl text-white mb-4">Thank you for voting!</h2>
              <p className="text-gray-300">Your vote has been recorded on the blockchain.</p>
            </div>
          ) : candidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <VotingCard
                  key={candidate.id}
                  candidate={candidate}
                  onVote={submitVote}
                  isVoting={voting}
                  isReadOnly={isReadOnly}
                  hasVoted={hasVoted}
                />
              ))}
            </div>
          ) : account ? (
            <div className="text-center p-6 bg-opacity-20 bg-white backdrop-blur-lg rounded-xl border border-white/10">
              <p className="text-gray-300 mb-4">No voting contract detected at the current address.</p>
              <p className="text-amber-400">Click "Deploy New Contract" above to deploy a voting contract.</p>
            </div>
          ) : (
            <div className="text-center p-6 bg-opacity-20 bg-white backdrop-blur-lg rounded-xl border border-white/10">
              <p className="text-gray-300">Connect your wallet to deploy a new voting contract or vote.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
