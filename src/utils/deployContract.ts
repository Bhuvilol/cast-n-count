
import { ethers } from 'ethers';
import VotingABI from '../contracts/Voting.json';
import { CONTRACT_ADDRESS } from './web3Config';

export const deployVotingContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is required to deploy the contract');
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    console.log('Deploying contract from:', await signer.getAddress());
    
    // Get the contract factory
    const factory = new ethers.ContractFactory(
      VotingABI.abi,
      // Get the bytecode from the compiled contract
      VotingABI.bytecode,
      signer
    );

    // Default candidate list
    const candidates = ['Candidate 1', 'Candidate 2', 'Candidate 3', 'Candidate 4'];
    
    // Deploy the contract
    const contract = await factory.deploy(candidates);
    
    // Wait for deployment to finish
    await contract.deployed();
    
    console.log('Contract deployed to:', contract.address);
    return contract.address;
  } catch (error) {
    console.error('Error deploying contract:', error);
    throw error;
  }
};
