import { ethers } from "ethers";
import { DAO_ABI, DAO_CONTRACT_ADDRESS } from "../constants/contracts";
import { getSigner } from "./provider";

export const getDAOContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(DAO_CONTRACT_ADDRESS, DAO_ABI, signer);
};
