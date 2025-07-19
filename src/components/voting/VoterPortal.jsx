import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button.jsx";
import { toast } from "@/hooks/use-toast.js";
import { getWeb3Provider } from '../../utils/web3Config.js';
import { getMockContract } from '../../utils/deployContract.js';

export const VoterPortal = ({ contractAddress, onBack }) => {
  const [account, setAccount] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoterRegistered, setIsVoterRegistered] = useState(false);
  const [votingActive, setVotingActive] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    if (isWalletConnected) {
      loadCandidates();
      checkVoterStatus();
    }
  }, [isWalletConnected]);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const { signer, error } = await getWeb3Provider(true);
      
      if (error) {
        handleWalletError(error);
        return;
      }
      
      if (signer) {
        const address = await signer.getAddress();
        setAccount(address);
        setIsWalletConnected(true);
        
        toast({
          title: "Wallet Connected!",
          description: `Connected to: ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
        
        await loadCandidates();
        await checkVoterStatus();
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWalletError = (error) => {
    switch (error) {
      case 'NO_WALLET':
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to use this voting system.",
          variant: "destructive",
        });
        break;
      case 'NO_ACCOUNTS':
        toast({
          title: "No Wallet Connected",
          description: "Please connect your MetaMask wallet to vote.",
          variant: "destructive",
        });
        break;
      case 'USER_REJECTED':
        toast({
          title: "Connection Rejected",
          description: "You rejected the wallet connection. Please try again.",
          variant: "destructive",
        });
        break;
      default:
        toast({
          title: "Wallet Error",
          description: "An error occurred while connecting to your wallet.",
          variant: "destructive",
        });
    }
  };

  const loadCandidates = async () => {
    try {
      const contract = getMockContract();
      const contractInfo = await contract.getContractInfo();
      setVotingActive(contractInfo._votingActive);
      setTotalVotes(contractInfo._totalVotes.toNumber());
      
      const count = await contract.getCandidatesCount();
      const candidatesList = [];
      for (let i = 0; i < count.toNumber(); i++) {
        const candidate = await contract.getCandidate(i);
        candidatesList.push({
          id: candidate.id.toNumber(),
          name: candidate.name,
          voteCount: candidate.voteCount.toNumber(),
        });
      }
      setCandidates(candidatesList);
    } catch (error) {
      console.error("Error loading candidates:", error);
    }
  };

  const checkVoterStatus = async () => {
    try {
      console.log('Checking voter status for account:', account);
      
      if (!account) {
        console.log('No account available, skipping voter status check');
        return;
      }
      
      // Always use the mock contract directly - no need for contract address
      const contract = getMockContract();
      const normalizedAccount = account.toLowerCase();
      
      console.log('Checking registration for normalized account:', normalizedAccount);
      
      const isRegistered = await contract.isVoterRegistered(normalizedAccount);
      const hasVotedStatus = await contract.hasVoted(normalizedAccount);
      
      console.log('Voter registration status:', isRegistered);
      console.log('Has voted status:', hasVotedStatus);
      
      setIsVoterRegistered(isRegistered);
      setHasVoted(hasVotedStatus);
    } catch (error) {
      console.error("Error checking voter status:", error);
    }
  };

  const submitVote = async (candidateId) => {
    try {
      setVoting(true);
      const { signer, error } = await getWeb3Provider();
      
      if (error) {
        handleWalletError(error);
        setVoting(false);
        return;
      }
      
      if (!signer) {
        toast({
          title: "Wallet Required",
          description: "Please connect your wallet to vote.",
          variant: "destructive",
        });
        setVoting(false);
        return;
      }
      
      if (!contractAddress) {
        toast({
          title: "No Contract Deployed",
          description: "Please wait for admin to deploy a contract.",
          variant: "destructive",
        });
        setVoting(false);
        return;
      }
      
      if (!isVoterRegistered) {
        toast({
          title: "Not Registered",
          description: "You are not registered to vote. Please contact the admin.",
          variant: "destructive",
        });
        setVoting(false);
        return;
      }
      
      if (!votingActive) {
        toast({
          title: "Voting Not Active",
          description: "Voting is not currently active.",
          variant: "destructive",
        });
        setVoting(false);
        return;
      }
      
      const contract = getMockContract();
      const voterAddress = await signer.getAddress();
      
      console.log('Submitting vote for candidate:', candidateId);
      console.log('Voter address:', voterAddress);
      
      const tx = await contract.vote(candidateId, voterAddress);
      await tx.wait();
      
      console.log('Vote transaction completed');
      
      toast({
        title: "Vote Recorded!",
        description: "Your vote has been successfully recorded on the blockchain.",
      });
      
      // Force reload data to reflect changes
      await loadCandidates();
      await checkVoterStatus();
      
      console.log('Vote submitted successfully, data reloaded');
      
    } catch (error) {
      console.error("Voting error:", error);
      
      let errorMessage = "Failed to record vote. Please try again.";
      
      if (error.message.includes('Already voted')) {
        errorMessage = "You have already voted. Each wallet can only vote once.";
      } else if (error.message.includes('Voter not registered')) {
        errorMessage = "You are not registered to vote. Please contact the admin.";
      } else if (error.message.includes('Voting is not active')) {
        errorMessage = "Voting is not currently active.";
      } else if (error.message.includes('Invalid candidate')) {
        errorMessage = "Invalid candidate selected.";
      } else if (error.message.includes('User rejected')) {
        errorMessage = "You rejected the transaction. Please try again.";
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for transaction. Please add some ETH to your wallet.";
      }
      
      toast({
        title: "Voting Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">🗳️ Voter Portal</h1>
              <p className="text-gray-300">Connect your wallet and cast your vote</p>
            </div>
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-gray-300 hover:text-white"
            >
              ← Back to Portal
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Voting Interface */}
          <div className="lg:col-span-2">
            {!isWalletConnected ? (
              /* Wallet Connection */
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔗</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                <p className="text-gray-300 mb-6">
                  Connect your MetaMask wallet to access the voting interface and cast your vote.
                </p>
                <Button
                  onClick={connectWallet}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  {loading ? "Connecting..." : "🔗 Connect Wallet"}
                </Button>
              </div>
            ) : (
              /* Voting Interface */
              <div className="space-y-6">
                {/* Wallet Info */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Connected Wallet</h3>
                      <p className="text-gray-300 font-mono">{account}</p>
                    </div>
                    <div className="flex space-x-2">
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        isVoterRegistered 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {isVoterRegistered ? 'Registered' : 'Not Registered'}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        hasVoted 
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                          : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}>
                        {hasVoted ? 'Voted' : 'Not Voted'}
                      </div>
                      <Button
                        onClick={checkVoterStatus}
                        variant="outline"
                        size="sm"
                        className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                      >
                        🔄 Refresh Status
                      </Button>
                      <Button
                        onClick={async () => {
                          if (!account) {
                            toast({
                              title: "No Wallet Connected",
                              description: "Please connect your wallet first.",
                              variant: "destructive",
                            });
                            return;
                          }
                          
                          try {
                            const contract = getMockContract();
                            const success = await contract.registerVoter(account);
                            if (success) {
                              toast({
                                title: "Voter Registered!",
                                description: "Your wallet has been registered as a voter.",
                              });
                              await checkVoterStatus();
                            }
                          } catch (error) {
                            console.error('Registration error:', error);
                            toast({
                              title: "Registration Failed",
                              description: "Only admin can register voters. Please contact admin.",
                              variant: "destructive",
                            });
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white ml-2"
                        disabled={!account}
                      >
                        📝 Register Me
                      </Button>
                      <Button
                        onClick={() => {
                          console.log('=== MANUAL DEBUG ===');
                          console.log('localStorage keys:', Object.keys(localStorage));
                          Object.keys(localStorage).forEach(key => {
                            console.log(`${key}:`, localStorage.getItem(key));
                          });
                          
                          // Create test data if localStorage is empty
                          if (Object.keys(localStorage).length === 0) {
                            console.log('localStorage is empty, creating test data...');
                            const testData = {
                              candidates: [],
                              voters: account ? [account.toLowerCase()] : [],
                              votingActive: true,
                              totalVotes: 0,
                              adminPassword: 'admin123'
                            };
                            localStorage.setItem('mockVotingData', JSON.stringify(testData));
                            localStorage.setItem('votingContractAddress', '0x' + Math.random().toString(16).substr(2, 40));
                            console.log('Test data created with current wallet address:', account);
                            
                            // Force reload candidates and check voter status
                            setTimeout(() => {
                              loadCandidates();
                              checkVoterStatus();
                            }, 100);
                          }
                          
                          console.log('=== END DEBUG ===');
                        }}
                        variant="outline"
                        size="sm"
                        className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-white ml-2"
                      >
                        🔍 Debug
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Candidates */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">👥 Candidates</h3>
                  
                  {candidates.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-gray-300">No candidates available for voting.</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Please ask the admin to add candidates in the Admin Portal.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {candidates.map((candidate) => (
                        <div key={candidate.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-semibold text-lg">{candidate.name}</h4>
                              <p className="text-gray-300">{candidate.voteCount} votes</p>
                            </div>
                            <Button
                              onClick={() => submitVote(candidate.id)}
                              disabled={
                                voting || 
                                hasVoted || 
                                !isVoterRegistered || 
                                !votingActive
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                            >
                              {voting ? "Voting..." : "🗳️ Vote"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Voting Status */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">📊 Voting Status</h3>
              
              <div className="space-y-4">
                <div className={`rounded-lg p-4 border ${
                  votingActive 
                    ? 'bg-green-500/20 border-green-500/30' 
                    : 'bg-red-500/20 border-red-500/30'
                }`}>
                  <p className={`text-sm ${votingActive ? 'text-green-300' : 'text-red-300'}`}>
                    Voting Status
                  </p>
                  <p className={`text-2xl font-bold ${votingActive ? 'text-green-400' : 'text-red-400'}`}>
                    {votingActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                
                <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">Total Votes</p>
                  <p className="text-white text-2xl font-bold">{totalVotes}</p>
                </div>
                
                <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                  <p className="text-purple-300 text-sm">Candidates</p>
                  <p className="text-white text-2xl font-bold">{candidates.length}</p>
                </div>
              </div>
            </div>

            {/* Voter Status */}
            {isWalletConnected && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">👤 Your Status</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Wallet Connected</span>
                    <span className="text-green-400">✅</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Voter Registered</span>
                    <span className={isVoterRegistered ? 'text-green-400' : 'text-red-400'}>
                      {isVoterRegistered ? '✅' : '❌'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Has Voted</span>
                    <span className={hasVoted ? 'text-blue-400' : 'text-gray-400'}>
                      {hasVoted ? '✅' : '⏳'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Can Vote</span>
                    <span className={
                      isVoterRegistered && !hasVoted && votingActive 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }>
                      {isVoterRegistered && !hasVoted && votingActive ? '✅' : '❌'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">ℹ️ Instructions</h3>
              
              <div className="space-y-3 text-sm text-gray-300">
                <p>• Connect your MetaMask wallet to start</p>
                <p>• Click "📝 Register Me" to register your wallet</p>
                <p>• You can only vote once per session</p>
                <p>• Voting must be active to cast votes</p>
                <p>• Your vote is permanently recorded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 