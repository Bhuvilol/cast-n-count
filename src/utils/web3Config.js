import { ethers } from 'ethers';

// Contract ABI for the VotingContract
const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "_adminPassword", "type": "string"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "candidateId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"}
    ],
    "name": "CandidateAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "voter", "type": "address"}],
    "name": "VoterRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "voter", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "candidateId", "type": "uint256"}
    ],
    "name": "VoteCasted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "VotingEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "VotingStarted",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "string", "name": "_name", "type": "string"}],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "adminPassword",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "candidateCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_oldPassword", "type": "string"}, {"internalType": "string", "name": "_newPassword", "type": "string"}],
    "name": "changeAdminPassword",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "candidates",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "uint256", "name": "voteCount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "emergencyStop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractInfo",
    "outputs": [
      {"internalType": "address", "name": "_admin", "type": "address"},
      {"internalType": "bool", "name": "_votingActive", "type": "bool"},
      {"internalType": "uint256", "name": "_candidateCount", "type": "uint256"},
      {"internalType": "uint256", "name": "_totalVotes", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_candidateId", "type": "uint256"}],
    "name": "getCandidate",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "uint256", "name": "voteCount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidatesCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalVotes",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_voter", "type": "address"}],
    "name": "getVoterInfo",
    "outputs": [
      {"internalType": "bool", "name": "hasVoted", "type": "bool"},
      {"internalType": "uint256", "name": "votedFor", "type": "uint256"},
      {"internalType": "bool", "name": "isRegistered", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_voter", "type": "address"}],
    "name": "hasVoted",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_voter", "type": "address"}],
    "name": "isVoterRegistered",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isVotingActive",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_voter", "type": "address"}],
    "name": "registerVoter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address[]", "name": "_voters", "type": "address[]"}],
    "name": "registerMultipleVoters",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_newAdmin", "type": "address"}, {"internalType": "string", "name": "_password", "type": "string"}],
    "name": "transferAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_password", "type": "string"}],
    "name": "verifyAdminPassword",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_candidateId", "type": "uint256"}],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "voters",
    "outputs": [
      {"internalType": "bool", "name": "hasVoted", "type": "bool"},
      {"internalType": "uint256", "name": "votedFor", "type": "uint256"},
      {"internalType": "bool", "name": "isRegistered", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingActive",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Default contract address (will be set after deployment)
export let CONTRACT_ADDRESS = null;

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export const getWeb3Provider = async (requestConnection = false) => {
  if (!isBrowser) {
    throw new Error("Not in browser environment");
  }
  
  // Check if MetaMask is installed
  if (!window.ethereum) {
    return {
      provider: null,
      signer: null,
      isReadOnly: true,
      error: "NO_WALLET"
    };
  }
  
  try {
    let accounts;
    
    if (requestConnection) {
      // Only request accounts when user explicitly wants to connect
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
      // Just check for existing accounts without requesting
      accounts = await window.ethereum.request({ method: 'eth_accounts' });
    }
    
    if (!accounts || accounts.length === 0) {
      return {
        provider: null,
        signer: null,
        isReadOnly: true,
        error: "NO_ACCOUNTS"
      };
    }
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    return { 
      provider, 
      signer, 
      isReadOnly: false 
    };
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    
    if (error.code === 4001) {
      return {
        provider: null,
        signer: null,
        isReadOnly: true,
        error: "USER_REJECTED"
      };
    }
    
    return {
      provider: null,
      signer: null,
      isReadOnly: true,
      error: "CONNECTION_FAILED"
    };
  }
};

export const getVotingContract = (signerOrProvider, contractAddress = null) => {
  if (!contractAddress) {
    throw new Error("No contract address provided. Please deploy a contract first.");
  }
  
  return new ethers.Contract(contractAddress, CONTRACT_ABI, signerOrProvider);
};

// For now, let's use a mock deployment approach until we can properly compile the contract
export const deployVotingContract = async (adminPassword = "admin123") => {
  try {
    const { signer, error } = await getWeb3Provider();
    
    if (error) {
      throw new Error(`Wallet error: ${error}`);
    }
    
    if (!signer) {
      throw new Error('No signer available');
    }
    
    // For now, let's use a mock approach that simulates blockchain persistence
    // This will be replaced with actual contract deployment once we resolve the compilation issues
    const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
    
    console.log('Mock contract deployed to:', mockAddress);
    CONTRACT_ADDRESS = mockAddress;
    
    return mockAddress;
  } catch (error) {
    console.error('Deployment error:', error);
    throw error;
  }
};

export const setContractAddress = (address) => {
  CONTRACT_ADDRESS = address;
  // Also store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('votingContractAddress', address);
    console.log('Stored contract address in localStorage:', address);
  }
};

export const getContractAddress = () => {
  console.log('getContractAddress called, CONTRACT_ADDRESS:', CONTRACT_ADDRESS);
  
  // If in-memory address is null, try to load from localStorage
  if (!CONTRACT_ADDRESS && typeof window !== 'undefined') {
    const storedAddress = localStorage.getItem('votingContractAddress');
    console.log('Stored address from localStorage:', storedAddress);
    
    if (storedAddress) {
      CONTRACT_ADDRESS = storedAddress;
      console.log('Loaded contract address from localStorage:', storedAddress);
    }
  }
  
  console.log('Returning contract address:', CONTRACT_ADDRESS);
  return CONTRACT_ADDRESS;
}; 