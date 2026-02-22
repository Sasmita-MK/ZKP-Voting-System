import { ethers } from "ethers";
import {
  VERIFIER_ABI,
  VERIFIER_CONTRACT_ADDRESS,
} from "../constants/contracts";
import { getSigner } from "./provider";

export const getVerifierContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(VERIFIER_CONTRACT_ADDRESS, VERIFIER_ABI, signer);
};
