import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button.jsx";
import { toast } from "@/hooks/use-toast.js";
import { getWeb3Provider } from '../../utils/web3Config.js';
import { 
  deployVotingContractWithSetup, 
  addCandidate, 
  startVoting, 
  endVoting, 
  registerVoter, 
  registerMultipleVoters,
  emergencyStop,
  verifyAdminPassword,
  getMockContract,
  resetVotingSystem,
  debugVotingData,
  clearAllVotingData
} from '../../utils/deployContract.js';

export const AdminDashboard = ({ contractAddress, onBack }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [newCandidate, setNewCandidate] = useState('');
  const [newVoter, setNewVoter] = useState('');
  const [voterList, setVoterList] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [votingActive, setVotingActive] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [currentContractAddress, setCurrentContractAddress] = useState(contractAddress);

  useEffect(() => {
    // Check if there's existing voting data
    const storedAddress = localStorage.getItem('votingContractAddress');
    if (storedAddress && !currentContractAddress) {
      setCurrentContractAddress(storedAddress);
    }
    
    if (currentContractAddress) {
      loadCandidates();
    }
  }, [currentContractAddress]);

  const handlePasswordVerification = async () => {
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter the admin password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const isValid = await verifyAdminPassword(password, currentContractAddress);
      
      if (isValid) {
        setIsAuthenticated(true);
        toast({
          title: "Authentication Successful",
          description: "You are now logged in as admin.",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: "Incorrect admin password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Password verification error:", error);
      toast({
        title: "Error",
        description: "Failed to verify password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async () => {
    try {
      if (!currentContractAddress) {
        setCandidates([]);
        return;
      }
      
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

  const handleDeployContract = async () => {
    try {
      setDeploying(true);
      const newContractAddress = await deployVotingContractWithSetup();
      
      localStorage.setItem('votingContractAddress', newContractAddress);
      setCurrentContractAddress(newContractAddress);
      
      toast({
        title: "Voting Session Created!",
        description: `New voting session started successfully. Contract deployed to: ${newContractAddress.slice(0, 6)}...${newContractAddress.slice(-4)}`,
      });
      
      await loadCandidates();
    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        title: "Session Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeploying(false);
    }
  };

  const handleAddCandidate = async () => {
    if (!newCandidate.trim()) {
      toast({
        title: "Error",
        description: "Please enter a candidate name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await addCandidate(newCandidate, currentContractAddress);
      setNewCandidate('');
      toast({
        title: "Success",
        description: `Candidate "${newCandidate}" added successfully.`,
      });
      await loadCandidates();
    } catch (error) {
      console.error("Add candidate error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartVoting = async () => {
    try {
      setLoading(true);
      await startVoting(currentContractAddress);
      toast({
        title: "Success",
        description: "Voting has been started successfully.",
      });
      await loadCandidates();
    } catch (error) {
      console.error("Start voting error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndVoting = async () => {
    try {
      setLoading(true);
      await endVoting(currentContractAddress);
      toast({
        title: "Success",
        description: "Voting has been ended successfully.",
      });
      await loadCandidates();
    } catch (error) {
      console.error("End voting error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterVoter = async () => {
    if (!newVoter.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet address.",
        variant: "destructive",
      });
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(newVoter)) {
      toast({
        title: "Error",
        description: "Please enter a valid Ethereum wallet address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await registerVoter(newVoter, currentContractAddress);
      setNewVoter('');
      toast({
        title: "Success",
        description: `Voter ${newVoter.slice(0, 6)}...${newVoter.slice(-4)} registered successfully.`,
      });
    } catch (error) {
      console.error("Register voter error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterMultipleVoters = async () => {
    if (!voterList.trim()) {
      toast({
        title: "Error",
        description: "Please enter wallet addresses (one per line).",
        variant: "destructive",
      });
      return;
    }

    const addresses = voterList.split('\n').map(addr => addr.trim()).filter(addr => addr);
    
    for (const addr of addresses) {
      if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
        toast({
          title: "Error",
          description: `Invalid address: ${addr}`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setLoading(true);
      await registerMultipleVoters(addresses, currentContractAddress);
      setVoterList('');
      toast({
        title: "Success",
        description: `${addresses.length} voters registered successfully.`,
      });
    } catch (error) {
      console.error("Register multiple voters error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetVoting = async () => {
    try {
      setLoading(true);
      await resetVotingSystem(currentContractAddress);
      
      // Clear local state
      setCurrentContractAddress(null);
      setCandidates([]);
      setVotingActive(false);
      setTotalVotes(0);
      
      toast({
        title: "Voting System Reset",
        description: "All voting data has been completely reset. You can deploy a new contract.",
      });
    } catch (error) {
      console.error("Reset voting error:", error);
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyStop = async () => {
    try {
      setLoading(true);
      await emergencyStop(currentContractAddress);
      toast({
        title: "Emergency Stop",
        description: "Voting has been emergency stopped.",
      });
      await loadCandidates();
    } catch (error) {
      console.error("Emergency stop error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPassword('');
    toast({
      title: "Logged Out",
      description: "You have been logged out of admin panel.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">👨‍💼 Admin Dashboard</h1>
              <p className="text-gray-300">Manage voting sessions and candidates</p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                ← Back to Portal
              </Button>
              {isAuthenticated && (
                <Button
                  onClick={logout}
                  variant="outline"
                  className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {!isAuthenticated ? (
          /* Admin Login Form */
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔐</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Admin Authentication</h2>
                <p className="text-gray-300">Enter admin password to access dashboard</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    onKeyPress={(e) => e.key === 'Enter' && handlePasswordVerification()}
                  />
                </div>
                
                <Button
                  onClick={handlePasswordVerification}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
                >
                  {loading ? "Verifying..." : "Login as Admin"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Admin Dashboard */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Admin Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contract Management */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">📋 Contract Management</h3>
                
                {!currentContractAddress ? (
                  <div className="text-center py-8">
                    <p className="text-gray-300 mb-4">No voting contract deployed yet.</p>
                    <Button
                      onClick={handleDeployContract}
                      disabled={deploying}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                      {deploying ? "Deploying..." : "🚀 Deploy New Contract"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                      <p className="text-green-300 text-sm">Contract Deployed</p>
                      <p className="text-white font-mono text-sm">{currentContractAddress}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={handleStartVoting}
                        disabled={loading || votingActive}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {votingActive ? "Voting Active" : "▶️ Start Voting"}
                      </Button>
                      <Button
                        onClick={handleEndVoting}
                        disabled={loading || !votingActive}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {!votingActive ? "Voting Ended" : "⏹️ End Voting"}
                      </Button>
                    </div>
                    
                    <Button
                      onClick={handleResetVoting}
                      variant="outline"
                      className="w-full text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                    >
                      🔄 Reset Voting Session
                    </Button>
                    
                    {/* Debug buttons */}
                    <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                      <h4 className="text-yellow-300 text-sm font-semibold mb-2">🔧 Debug Tools</h4>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            debugVotingData();
                            toast({
                              title: "Debug Data",
                              description: "Check browser console for voting data details",
                            });
                          }}
                          variant="outline"
                          size="sm"
                          className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-white"
                        >
                          Debug Data
                        </Button>
                        <Button
                          onClick={() => {
                            clearAllVotingData();
                            setCandidates([]);
                            setVotingActive(false);
                            setTotalVotes(0);
                            toast({
                              title: "Data Cleared",
                              description: "All voting data has been cleared",
                            });
                          }}
                          variant="outline"
                          size="sm"
                          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                        >
                          Clear All Data
                        </Button>
                        <Button
                          onClick={async () => {
                            try {
                              const address = await deployVotingContractWithSetup("admin123");
                              toast({
                                title: "Test Contract Deployed",
                                description: `Contract deployed to: ${address}`,
                              });
                            } catch (error) {
                              toast({
                                title: "Deployment Failed",
                                description: error.message,
                                variant: "destructive",
                              });
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                        >
                          Deploy Test Contract
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Candidate Management */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">👥 Candidate Management</h3>
                
                <div className="flex space-x-4 mb-4">
                  <input
                    type="text"
                    value={newCandidate}
                    onChange={(e) => setNewCandidate(e.target.value)}
                    placeholder="Enter candidate name"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCandidate()}
                  />
                  <Button
                    onClick={handleAddCandidate}
                    disabled={loading || !newCandidate.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <span className="text-white font-medium">{candidate.name}</span>
                      <span className="text-gray-300 text-sm">{candidate.voteCount} votes</span>
                    </div>
                  ))}
                  {candidates.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No candidates added yet</p>
                  )}
                </div>
              </div>

              {/* Voter Registration */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">👤 Voter Registration</h3>
                
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={newVoter}
                      onChange={(e) => setNewVoter(e.target.value)}
                      placeholder="Enter wallet address"
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                    <Button
                      onClick={handleRegisterVoter}
                      disabled={loading || !newVoter.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Register
                    </Button>
                  </div>
                  
                  <div>
                    <textarea
                      value={voterList}
                      onChange={(e) => setVoterList(e.target.value)}
                      placeholder="Enter multiple wallet addresses (one per line)"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      rows="4"
                    />
                    <Button
                      onClick={handleRegisterMultipleVoters}
                      disabled={loading || !voterList.trim()}
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    >
                      Register Multiple Voters
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Emergency */}
            <div className="space-y-6">
              {/* Voting Stats */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">📊 Voting Statistics</h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                    <p className="text-blue-300 text-sm">Total Votes</p>
                    <p className="text-white text-2xl font-bold">{totalVotes}</p>
                  </div>
                  
                  <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                    <p className="text-green-300 text-sm">Candidates</p>
                    <p className="text-white text-2xl font-bold">{candidates.length}</p>
                  </div>
                  
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
                </div>
              </div>

              {/* Emergency Controls */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">🚨 Emergency Controls</h3>
                
                <Button
                  onClick={handleEmergencyStop}
                  disabled={loading || !votingActive}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
                >
                  🛑 Emergency Stop Voting
                </Button>
                
                <p className="text-gray-400 text-sm mt-2">
                  Use this only in emergency situations to immediately stop all voting.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 