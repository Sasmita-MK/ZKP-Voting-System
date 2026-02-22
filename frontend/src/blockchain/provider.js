import { ethers } from "ethers";

export const getProvider = () => {
  if (!window.ethereum) return null;
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) throw new Error("No wallet detected");
  return await provider.getSigner();
};
