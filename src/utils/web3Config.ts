
import { ethers } from 'ethers';
import VotingABI from '../contracts/Voting.json';

export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

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
