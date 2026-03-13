import { ethers } from "ethers";

// Deployment addresses from your Hardhat run
export const DAO_CONTRACT_ADDRESS =
  "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
export const VERIFIER_CONTRACT_ADDRESS =
  "0x5fbdb2315678afecb367f032d93f642f64180aa3";

// Professional ABI - Matches your DAOVoting.sol
export const DAO_ABI = [
  "function createProposal(uint256 proposalId, string title, string description, uint256 endTime) public",
  "function vote(uint256 proposalId, uint256 optionIndex, uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[1] publicSignals, uint256 nullifierHash) external",
  "function proposals(uint256) public view returns (string title, string description, uint256 endTime, bool exists, uint256 totalVotes)",
  "function getOptionVotes(uint256 proposalId, uint256 optionIndex) public view returns (uint256)",
];

/**
 * Professional getContract function (Ethers v6)
 * @param {ethers.Signer} signer - Pass the signer from App.jsx
 */
export const getContract = (signer) => {
  if (!signer) {
    throw new Error("No signer provided. Please connect MetaMask.");
  }
  // Ethers v6 uses (address, abi, signer)
  return new ethers.Contract(DAO_CONTRACT_ADDRESS, DAO_ABI, signer);
};
