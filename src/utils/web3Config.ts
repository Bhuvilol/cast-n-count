
import { ethers } from 'ethers';
import VotingABI from '../contracts/Voting.json';

// This is a sample deployed contract on Sepolia testnet
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const getWeb3Provider = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask to use this application");
  }
  
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  return { provider, signer };
};

export const getVotingContract = (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signer);
};
