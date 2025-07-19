import { ethers } from 'ethers';
import { deployVotingContract, getWeb3Provider, getVotingContract, setContractAddress } from './web3Config.js';

// Mock data storage for persistence
let mockCandidates = [];
let mockVoters = new Set();
let mockVotingActive = false;
let mockTotalVotes = 0;
let mockAdminPassword = "admin123";

// Deploy the voting contract with admin functionality
export const deployVotingContractWithSetup = async (adminPassword = "admin123") => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is required to deploy the contract. Please install MetaMask and try again.');
    }

    // Check if user has accounts and request connection if needed
    let accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (!accounts || accounts.length === 0) {
      // Request account access
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('Failed to connect wallet. Please approve the connection in MetaMask.');
      }
    }

    // Check network (support for Sepolia, Mainnet, and Polygon)
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const supportedNetworks = ['0x1', '0xaa36a7', '0x89']; // Mainnet, Sepolia, Polygon
    if (!supportedNetworks.includes(chainId)) {
      throw new Error('Please switch to Ethereum Mainnet, Sepolia, or Polygon network.');
    }
    
    // Deploy the contract (mock for now)
    const contractAddress = await deployVotingContract(adminPassword);
    setContractAddress(contractAddress);
    
    // Initialize mock data
    mockAdminPassword = adminPassword;
    mockCandidates = [
      { id: 0, name: 'Modi', voteCount: 0 },
      { id: 1, name: 'Rahul', voteCount: 0 },
      { id: 2, name: 'Kejriwal', voteCount: 0 },
      { id: 3, name: 'Mamata', voteCount: 0 }
    ];
    mockVoters.clear();
    mockVotingActive = false;
    mockTotalVotes = 0;
    
    // Store mock data in localStorage for persistence
    localStorage.setItem('mockVotingData', JSON.stringify({
      candidates: mockCandidates,
      voters: Array.from(mockVoters),
      votingActive: mockVotingActive,
      totalVotes: mockTotalVotes,
      adminPassword: mockAdminPassword
    }));
    
    console.log('Mock contract deployed to:', contractAddress);
    return contractAddress;
  } catch (error) {
    console.error('Deployment error:', error);
    
    let errorMessage = "Failed to deploy voting contract. Please try again.";
    
    if (error.message.includes('MetaMask is required')) {
      errorMessage = "MetaMask is required to deploy contracts. Please install MetaMask and try again.";
    } else if (error.message.includes('No accounts found')) {
      errorMessage = "No wallet accounts found. Please connect your MetaMask wallet first.";
    } else if (error.message.includes('Failed to connect wallet')) {
      errorMessage = "Failed to connect wallet. Please approve the connection in MetaMask.";
    } else if (error.message.includes('switch to')) {
      errorMessage = "Please switch to Ethereum Mainnet, Sepolia, or Polygon network in MetaMask.";
    } else if (error.message.includes('User rejected')) {
      errorMessage = "You rejected the transaction. Please try again and approve the transaction.";
    } else if (error.message.includes('insufficient funds')) {
      errorMessage = "Insufficient funds for deployment. Please add some ETH to your wallet.";
    }
    
    throw new Error(errorMessage);
  }
};

// Load mock data from localStorage
const loadMockData = () => {
  try {
    const stored = localStorage.getItem('mockVotingData');
    console.log('Loading mock data from localStorage:', stored);
    
    if (stored) {
      const data = JSON.parse(stored);
      mockCandidates = data.candidates || [];
      mockVoters = new Set(data.voters || []);
      mockVotingActive = data.votingActive || false;
      mockTotalVotes = data.totalVotes || 0;
      mockAdminPassword = data.adminPassword || "admin123";
      console.log('Loaded mock data:', {
        candidates: mockCandidates.length,
        voters: mockVoters.size,
        votingActive: mockVotingActive,
        totalVotes: mockTotalVotes
      });
      console.log('Loaded voters:', Array.from(mockVoters));
    } else {
      console.log('No stored mock data found, using defaults');
    }
  } catch (error) {
    console.error('Error loading mock data:', error);
    // Reset to defaults if there's an error
    mockCandidates = [];
    mockVoters = new Set();
    mockVotingActive = false;
    mockTotalVotes = 0;
    mockAdminPassword = "admin123";
  }
};

// Save mock data to localStorage
const saveMockData = () => {
  try {
    const data = {
      candidates: mockCandidates,
      voters: Array.from(mockVoters),
      votingActive: mockVotingActive,
      totalVotes: mockTotalVotes,
      adminPassword: mockAdminPassword
    };
    localStorage.setItem('mockVotingData', JSON.stringify(data));
    console.log('Saved mock data:', {
      candidates: mockCandidates.length,
      voters: mockVoters.size,
      votingActive: mockVotingActive,
      totalVotes: mockTotalVotes
    });
    console.log('Saved voters:', Array.from(mockVoters));
  } catch (error) {
    console.error('Error saving mock data:', error);
  }
};

// Initialize mock data on module load
loadMockData();

// Debug function to check current state
export const debugVotingData = () => {
  console.log('=== DEBUG VOTING DATA ===');
  console.log('Mock candidates:', mockCandidates);
  console.log('Mock voters:', Array.from(mockVoters));
  console.log('Mock voting active:', mockVotingActive);
  console.log('Mock total votes:', mockTotalVotes);
  
  const stored = localStorage.getItem('mockVotingData');
  console.log('Stored data:', stored ? JSON.parse(stored) : 'No stored data');
  
  const votedAddresses = localStorage.getItem('votedAddresses');
  console.log('Voted addresses:', votedAddresses ? JSON.parse(votedAddresses) : 'No voted addresses');
  
  console.log('=== END DEBUG ===');
};

// Clear all voting data (for debugging)
export const clearAllVotingData = () => {
  console.log('Clearing all voting data...');
  mockCandidates = [];
  mockVoters.clear();
  mockVotingActive = false;
  mockTotalVotes = 0;
  
  localStorage.removeItem('mockVotingData');
  localStorage.removeItem('votedAddresses');
  localStorage.removeItem('votingContractAddress');
  
  console.log('All voting data cleared');
};

// Register a voter (admin function)
export const registerVoter = async (voterAddress, contractAddress) => {
  try {
    // Ensure mock data is loaded
    loadMockData();
    
    console.log('Registering voter:', voterAddress);
    // Store address in lowercase for consistency
    const normalizedAddress = voterAddress.toLowerCase();
    mockVoters.add(normalizedAddress);
    saveMockData();
    console.log('Current registered voters:', Array.from(mockVoters));
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Failed to register voter. Make sure you are the admin.');
  }
};

// Register multiple voters (admin function)
export const registerMultipleVoters = async (voterAddresses, contractAddress) => {
  try {
    // Ensure mock data is loaded
    loadMockData();
    
    for (const address of voterAddresses) {
      // Store address in lowercase for consistency
      const normalizedAddress = address.toLowerCase();
      mockVoters.add(normalizedAddress);
    }
    saveMockData();
    console.log('Registered multiple voters:', voterAddresses);
    console.log('Current registered voters:', Array.from(mockVoters));
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Failed to register voters. Make sure you are the admin.');
  }
};

// Admin functions
export const addCandidate = async (candidateName, contractAddress) => {
  try {
    if (mockVotingActive) {
      throw new Error('Cannot add candidates while voting is active');
    }
    
    const newCandidate = {
      id: mockCandidates.length,
      name: candidateName,
      voteCount: 0
    };
    mockCandidates.push(newCandidate);
    saveMockData();
    console.log('Added candidate:', newCandidate);
    console.log('Current candidates:', mockCandidates);
    return true;
  } catch (error) {
    console.error('Add candidate error:', error);
    throw new Error('Failed to add candidate. Make sure you are the admin and voting is not active.');
  }
};

export const startVoting = async (contractAddress) => {
  try {
    if (mockCandidates.length === 0) {
      throw new Error('No candidates added');
    }
    mockVotingActive = true;
    saveMockData();
    return true;
  } catch (error) {
    console.error('Start voting error:', error);
    throw new Error('Failed to start voting. Make sure you are the admin and candidates are added.');
  }
};

export const endVoting = async (contractAddress) => {
  try {
    mockVotingActive = false;
    saveMockData();
    return true;
  } catch (error) {
    console.error('End voting error:', error);
    throw new Error('Failed to end voting. Make sure you are the admin.');
  }
};

export const emergencyStop = async (contractAddress) => {
  try {
    mockVotingActive = false;
    saveMockData();
    return true;
  } catch (error) {
    console.error('Emergency stop error:', error);
    throw new Error('Failed to stop voting. Make sure you are the admin.');
  }
};

// Reset voting system completely (admin function)
export const resetVotingSystem = async (contractAddress) => {
  try {
    mockCandidates = [];
    mockVoters.clear();
    mockVotingActive = false;
    mockTotalVotes = 0;
    
    // Clear all localStorage data
    localStorage.removeItem('mockVotingData');
    localStorage.removeItem('votedAddresses');
    localStorage.removeItem('votingContractAddress');
    
    console.log('Voting system reset completely');
    return true;
  } catch (error) {
    console.error('Reset voting system error:', error);
    throw new Error('Failed to reset voting system. Make sure you are the admin.');
  }
};

// Verify admin password
export const verifyAdminPassword = async (password, contractAddress) => {
  try {
    return password === mockAdminPassword;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

// Mock contract functions for the frontend
export const getMockContract = () => {
  // Ensure mock data is loaded
  loadMockData();
  
  return {
    getCandidatesCount: async () => ({ toNumber: () => mockCandidates.length }),
    getCandidate: async (index) => {
      if (index >= mockCandidates.length) {
        throw new Error('Invalid candidate index');
      }
      const candidate = mockCandidates[index];
      return {
        id: { toNumber: () => candidate.id },
        name: candidate.name,
        voteCount: { toNumber: () => candidate.voteCount }
      };
    },
    hasVoted: async (address) => {
      // This should track who has actually voted, not who is registered
      // For now, we'll use a separate set to track votes
      const votedAddresses = JSON.parse(localStorage.getItem('votedAddresses') || '[]');
      const normalizedAddress = address.toLowerCase();
      return votedAddresses.includes(normalizedAddress);
    },
    vote: async (candidateId, voterAddress) => {
      // Ensure mock data is loaded
      loadMockData();
      
      console.log('Vote function called with candidateId:', candidateId, 'voterAddress:', voterAddress);
      
      if (!mockVotingActive) {
        throw new Error('Voting is not active');
      }
      
      const normalizedAddress = voterAddress.toLowerCase();
      if (!mockVoters.has(normalizedAddress)) {
        throw new Error('Voter not registered');
      }
      
      if (candidateId >= mockCandidates.length) {
        throw new Error('Invalid candidate');
      }
      
      console.log('Before vote - Candidate vote count:', mockCandidates[candidateId].voteCount);
      mockCandidates[candidateId].voteCount++;
      mockTotalVotes++;
      console.log('After vote - Candidate vote count:', mockCandidates[candidateId].voteCount);
      console.log('Total votes:', mockTotalVotes);
      
      // Track that this address has voted
      const votedAddresses = JSON.parse(localStorage.getItem('votedAddresses') || '[]');
      if (!votedAddresses.includes(normalizedAddress)) {
        votedAddresses.push(normalizedAddress);
        localStorage.setItem('votedAddresses', JSON.stringify(votedAddresses));
        console.log('Added voter to voted addresses:', normalizedAddress);
      }
      
      saveMockData();
      console.log('Data saved after vote');
      
      return { 
        wait: async () => {
          // Simulate transaction confirmation
          await new Promise(resolve => setTimeout(resolve, 1000));
        } 
      };
    },
    registerVoter: async (address) => {
      // Ensure mock data is loaded
      loadMockData();
      
      const normalizedAddress = address.toLowerCase();
      mockVoters.add(normalizedAddress);
      saveMockData();
      
      console.log('Registered voter:', normalizedAddress);
      console.log('Current registered voters:', Array.from(mockVoters));
      
      return true;
    },
    isVoterRegistered: async (address) => {
      // Always try to load fresh data from localStorage
      const stored = localStorage.getItem('mockVotingData');
      console.log('Direct localStorage check:', stored);
      
      if (stored) {
        const data = JSON.parse(stored);
        mockVoters = new Set(data.voters || []);
        console.log('Loaded voters directly from localStorage:', Array.from(mockVoters));
      } else {
        console.log('No stored data found, using current mockVoters');
        loadMockData();
      }
      
      console.log('Checking if voter is registered:', address);
      console.log('Current registered voters:', Array.from(mockVoters));
      console.log('Address in lowercase:', address.toLowerCase());
      
      // Check both original case and lowercase
      const isRegistered = mockVoters.has(address) || mockVoters.has(address.toLowerCase());
      console.log('Final registration status:', isRegistered);
      
      return isRegistered;
    },
    isVotingActive: async () => {
      return mockVotingActive;
    },
    getTotalVotes: async () => {
      return { toNumber: () => mockTotalVotes };
    },
    getContractInfo: async () => {
      return {
        _admin: "0x0000000000000000000000000000000000000000", // Mock admin address
        _votingActive: mockVotingActive,
        _candidateCount: { toNumber: () => mockCandidates.length },
        _totalVotes: { toNumber: () => mockTotalVotes }
      };
    }
  };
}; 