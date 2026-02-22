/* global BigInt */
/* eslint-disable no-undef */
import * as snarkjs from "snarkjs";
import { buildPoseidon } from "circomlibjs";
import { Buffer } from "buffer";

window.Buffer = Buffer;

export const generateZKP = async (secretNumber, proposalId) => {
  const poseidon = await buildPoseidon();
  const F = poseidon.F;

  const safeHash = (inputs) => {
    const res = poseidon(inputs);
    return BigInt(F.toString(res));
  };

  // 1. Setup Members and Secret
  const members = [11n, 22n, 33n, 44n, 55n, 66n, 77n, 88n];
  const secret = BigInt(secretNumber);
  const leafIndex = members.indexOf(secret);
  if (leafIndex === -1) throw new Error("Secret not found in member list");

  // 2. Define the "Zero Value" for empty nodes
  // Standard practice: if a sibling doesn't exist, we use 0
  const ZERO_VALUE = 0n;

  // 3. Build Tree Path up to Depth 20
  let pathElements = [];
  let pathIndices = [];
  let currentNodes = members.map((m) => safeHash([m]));
  let tempIdx = leafIndex;

  // We MUST loop 20 times because your circuit depth is 20
  for (let i = 0; i < 20; i++) {
    let levelLen = currentNodes.length;

    if (levelLen > 1 || (levelLen === 1 && i < 20)) {
      let isLeft = tempIdx % 2 === 0;
      let siblingIdx = isLeft ? tempIdx + 1 : tempIdx - 1;

      // If sibling is outside current members, use ZERO_VALUE
      let sibling =
        siblingIdx < levelLen ? currentNodes[siblingIdx] : ZERO_VALUE;

      pathElements.push(sibling.toString());
      pathIndices.push(isLeft ? 0 : 1);

      // Calculate next level
      let nextLevel = [];
      for (let j = 0; j < levelLen; j += 2) {
        let l = currentNodes[j];
        let r = j + 1 < levelLen ? currentNodes[j + 1] : ZERO_VALUE;
        nextLevel.push(safeHash([l, r]));
      }
      currentNodes = nextLevel;
      tempIdx = Math.floor(tempIdx / 2);
    }
  }

  // The root is the final hash after 20 iterations
  const root = currentNodes[0].toString();

  const input = {
    root: root,
    secret: secret.toString(),
    pathElements: pathElements,
    pathIndices: pathIndices,
  };

  console.log("Root calculated for Depth 20:", root);

  try {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      "/zkp/membership.wasm",
      "/zkp/membership_final.zkey",
    );

    const calldata = await snarkjs.groth16.exportSolidityCallData(
      proof,
      publicSignals,
    );
    const argv = JSON.parse("[" + calldata + "]");
    const nullifierHash = safeHash([secret, BigInt(proposalId)]).toString();

    return {
      a: argv[0],
      b: argv[1],
      c: argv[2],
      publicSignals: argv[3],
      nullifierHash: nullifierHash,
    };
  } catch (err) {
    console.error("Proving Error:", err);
    throw err;
  }
};
