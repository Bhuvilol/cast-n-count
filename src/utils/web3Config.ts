
import { ethers } from 'ethers';
import VotingABI from '../contracts/Voting.json';

// This is a sample deployed contract on Sepolia testnet
// Use a public Alchemy or Ankr RPC URL instead of the restricted Infura one
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Check if we're in a browser environment before accessing window
const isBrowser = typeof window !== 'undefined';

export const getWeb3Provider = async () => {
  // Basic environment check
  if (!isBrowser) {
    throw new Error("Not in browser environment");
  }
  
  // Check if MetaMask is installed
  if (!window.ethereum) {
    // Use a fallback provider for testing when MetaMask is not available
    console.log("MetaMask not detected, using fallback provider");
    return {
      provider: new ethers.providers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io"),
      signer: null,
      isReadOnly: true
    };
  }
  
  try {
    // Request accounts from MetaMask
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    return { provider, signer, isReadOnly: false };
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    // Fallback to read-only mode if user rejects wallet connection
    return {
      provider: new ethers.providers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io"),
      signer: null,
      isReadOnly: true
    };
  }
};

export const getVotingContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signerOrProvider);
};
