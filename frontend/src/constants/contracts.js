import { ethers } from "ethers";

// Your specific addresses from the provided code
export const DAO_CONTRACT_ADDRESS =
  "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
export const VERIFIER_CONTRACT_ADDRESS =
  "0x5fbdb2315678afecb367f032d93f642f64180aa3";

// Standard ABI for a ZKP DAO
const DAO_ABI = [
  "function createProposal(uint256 proposalId, string memory description) public",

  // Updated to include the 6th argument: nullifierHash
  "function vote(uint256 proposalId, uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[1] input, uint256 nullifier) public",

  "function proposals(uint256) public view returns (string description, uint256 voteCount, bool exists)",
  "function getProposals() public view returns (tuple(string description, uint256 voteCount, bool exists)[])",
];

export const getContract = async () => {
  if (!window.ethereum) {
    alert("MetaMask not found!");
    throw new Error("No crypto wallet found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // We return the DAO contract because that is the "entry point" for your app
  return new ethers.Contract(DAO_CONTRACT_ADDRESS, DAO_ABI, signer);
};
