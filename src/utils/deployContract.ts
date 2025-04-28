
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
      VotingABI.bytecode,
      signer
    );

    // Set the two candidates
    const candidates = ['Modi', 'Rahul'];
    
    // Deploy the contract with the two candidates
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

