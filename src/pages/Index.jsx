import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button.jsx";
import { toast } from "@/hooks/use-toast.js";
import { getWeb3Provider, getVotingContract, getContractAddress, setContractAddress } from '../utils/web3Config.js';
import { deployVotingContractWithSetup, registerVoter, getMockContract } from '../utils/deployContract.js';
import { AdminDashboard } from '../components/voting/AdminDashboard.jsx';
import { VoterPortal } from '../components/voting/VoterPortal.jsx';

const Index = () => {
  // Page states
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'admin', 'voter'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Contract state
  const [contractAddress, setContractAddress] = useState(null);

  useEffect(() => {
    const init = () => {
      try {
        console.log("Initializing Index component...");
        
        // Get contract address using the utility function
        const contractAddress = getContractAddress();
        console.log("Retrieved contract address:", contractAddress);
        
        if (contractAddress) {
          setContractAddress(contractAddress);
          console.log("Set contract address to:", contractAddress);
        } else {
          console.log("No contract address found");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Initialization error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleEnterVotingPortal = () => {
    setCurrentPage('portal-selection');
  };

  const handleAdminLogin = () => {
    setCurrentPage('admin');
  };

  const handleVoterLogin = () => {
    setCurrentPage('voter');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleBackToPortal = () => {
    setCurrentPage('portal-selection');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg font-semibold">Loading voting system...</div>
        </div>
      </div>
    );
  }

  // Landing Page
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10 container mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                🗳️ Cast & Count
              </h1>
              <p className="text-xl text-gray-300 mb-8">Decentralized Voting System</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Welcome to Cast & Count</h2>
                <p className="text-gray-300 text-lg">
                  A secure, transparent, and immutable voting system powered by blockchain technology.
                </p>
              </div>

              {/* How to Vote Steps */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">How to Vote</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <div>
                        <h4 className="text-white font-semibold">Enter Voting Portal</h4>
                        <p className="text-gray-300">Access the secure voting interface</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <div>
                        <h4 className="text-white font-semibold">Connect Wallet</h4>
                        <p className="text-gray-300">Link your MetaMask wallet to vote</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                      <div>
                        <h4 className="text-white font-semibold">Cast Your Vote</h4>
                        <p className="text-gray-300">Vote for your preferred candidate</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">System Features</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-400">🔒</span>
                        <div>
                          <h4 className="text-white font-semibold">Blockchain Security</h4>
                          <p className="text-gray-300 text-sm">All votes are permanently recorded and cannot be altered</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                      <div className="flex items-center space-x-3">
                        <span className="text-green-400">👤</span>
                        <div>
                          <h4 className="text-white font-semibold">One Vote Per Wallet</h4>
                          <p className="text-gray-300 text-sm">Each wallet address can only vote once per session</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                      <div className="flex items-center space-x-3">
                        <span className="text-purple-400">👨‍💼</span>
                        <div>
                          <h4 className="text-white font-semibold">Admin Control</h4>
                          <p className="text-gray-300 text-sm">Only admin can manage candidates and voting sessions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enter Voting Portal Button */}
              <div className="text-center">
                <Button
                  onClick={handleEnterVotingPortal}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  🚪 Enter Voting Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Portal Selection Page
  if (currentPage === 'portal-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10 container mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                🗳️ Cast & Count
              </h1>
              <p className="text-xl text-gray-300 mb-8">Decentralized Voting System</p>
            </div>
          </div>
        </div>

        {/* Portal Selection */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Button
                onClick={handleBackToLanding}
                variant="ghost"
                className="text-gray-300 hover:text-white mb-4"
              >
                ← Back to Landing
              </Button>
              <h2 className="text-3xl font-bold text-white mb-4">Select Your Portal</h2>
              <p className="text-gray-300 text-lg">
                Choose whether you're an admin or a voter
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Admin Portal */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">👨‍💼</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Admin Portal</h3>
                  <p className="text-gray-300 mb-6">
                    Manage candidates, control voting sessions, and oversee the entire voting process.
                  </p>
                  <Button
                    onClick={handleAdminLogin}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    🔐 Admin Login
                  </Button>
                </div>
              </div>

              {/* Voter Portal */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Voter Portal</h3>
                  <p className="text-gray-300 mb-6">
                    Connect your wallet and cast your vote for your preferred candidate.
                  </p>
                  <Button
                    onClick={handleVoterLogin}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    🗳️ Vote Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (currentPage === 'admin') {
    return (
      <AdminDashboard 
        contractAddress={contractAddress}
        onBack={handleBackToPortal}
      />
    );
  }

  // Voter Portal
  if (currentPage === 'voter') {
    return (
      <VoterPortal 
        contractAddress={contractAddress}
        onBack={handleBackToPortal}
      />
    );
  }

  return null;
};

export default Index; 