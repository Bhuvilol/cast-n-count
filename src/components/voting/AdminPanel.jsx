import { useState } from 'react';
import { Button } from "@/components/ui/button.jsx";
import { toast } from "@/hooks/use-toast.js";
import { 
  addCandidate, 
  startVoting, 
  endVoting, 
  registerVoter, 
  registerMultipleVoters,
  emergencyStop,
  verifyAdminPassword 
} from '../../utils/deployContract.js';
import { getVotingContract, getWeb3Provider } from '../../utils/web3Config.js';

export const AdminPanel = ({ contractAddress, account, onUpdate }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newCandidate, setNewCandidate] = useState('');
  const [newVoter, setNewVoter] = useState('');
  const [voterList, setVoterList] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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
      const isValid = await verifyAdminPassword(password, contractAddress);
      
      if (isValid) {
        setIsAuthenticated(true);
        setShowPasswordForm(false);
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
      await addCandidate(newCandidate, contractAddress);
      setNewCandidate('');
      toast({
        title: "Success",
        description: `Candidate "${newCandidate}" added successfully.`,
      });
      onUpdate();
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
      await startVoting(contractAddress);
      toast({
        title: "Success",
        description: "Voting has been started successfully.",
      });
      onUpdate();
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
      await endVoting(contractAddress);
      toast({
        title: "Success",
        description: "Voting has been ended successfully.",
      });
      onUpdate();
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

    // Basic address validation
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
      await registerVoter(newVoter, contractAddress);
      setNewVoter('');
      toast({
        title: "Success",
        description: `Voter ${newVoter.slice(0, 6)}...${newVoter.slice(-4)} registered successfully.`,
      });
      onUpdate();
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
    
    // Validate all addresses
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
      await registerMultipleVoters(addresses, contractAddress);
      setVoterList('');
      toast({
        title: "Success",
        description: `${addresses.length} voters registered successfully.`,
      });
      onUpdate();
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

  const handleEmergencyStop = async () => {
    try {
      setLoading(true);
      await emergencyStop(contractAddress);
      toast({
        title: "Emergency Stop",
        description: "Voting has been stopped immediately.",
      });
      onUpdate();
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

  if (!contractAddress) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">🛡️ Admin Panel</h3>
        {isAuthenticated && (
          <Button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-300 mb-4">Enter admin password to access admin functions</p>
            <div className="flex space-x-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin Password"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handlePasswordVerification}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Login"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Add Candidate */}
          <div className="bg-white/5 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">➕ Add Candidate</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCandidate}
                onChange={(e) => setNewCandidate(e.target.value)}
                placeholder="Candidate name"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleAddCandidate}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>

          {/* Voting Control */}
          <div className="bg-white/5 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">🗳️ Voting Control</h4>
            <div className="flex space-x-2">
              <Button
                onClick={handleStartVoting}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {loading ? "Starting..." : "Start Voting"}
              </Button>
              <Button
                onClick={handleEndVoting}
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50"
              >
                {loading ? "Ending..." : "End Voting"}
              </Button>
              <Button
                onClick={handleEmergencyStop}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {loading ? "Stopping..." : "Emergency Stop"}
              </Button>
            </div>
          </div>

          {/* Register Voter */}
          <div className="bg-white/5 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">👤 Register Voter</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newVoter}
                onChange={(e) => setNewVoter(e.target.value)}
                placeholder="Wallet address (0x...)"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleRegisterVoter}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
          </div>

          {/* Register Multiple Voters */}
          <div className="bg-white/5 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">👥 Register Multiple Voters</h4>
            <textarea
              value={voterList}
              onChange={(e) => setVoterList(e.target.value)}
              placeholder="Enter wallet addresses (one per line)&#10;0x1234...&#10;0x5678..."
              className="w-full h-32 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <Button
              onClick={handleRegisterMultipleVoters}
              disabled={loading}
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register All"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 