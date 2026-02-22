// scripts/generateTree.js
const circomlibjs = require("circomlibjs");
const { MerkleTree } = require("merkletreejs");
const fs = require("fs");
const path = require("path");

(async () => {
  const poseidon = await circomlibjs.buildPoseidon();
  const F = poseidon.F;

  // DAO member secrets
  const members = [11n, 22n, 33n, 44n, 55n, 66n, 77n, 88n];

  // Hash leaves (Poseidon(1))
  const leaves = members.map((m) => Buffer.from(F.toString(poseidon([m]))));

  // Merkle hash function (Poseidon(2))
  const hashFn = (left, right) => {
    if (!right) right = left; // critical fix

    const l = BigInt("0x" + left.toString("hex"));
    const r = BigInt("0x" + right.toString("hex"));

    return Buffer.from(F.toString(poseidon([l, r])));
  };

  const tree = new MerkleTree(leaves, hashFn, {
    sortPairs: false,
  });

  // ===== NEW: MERKLE ROOT HANDLING =====
  const merkleRoot = BigInt("0x" + tree.getRoot().toString("hex")).toString();

  console.log("🌳 Merkle Root:", merkleRoot);

  // Ensure artifacts folder exists
  const artifactsDir = path.join(__dirname, "../artifacts");
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir);
  }

  fs.writeFileSync(
    path.join(artifactsDir, "merkle.json"),
    JSON.stringify({ merkleRoot }, null, 2),
  );

  // ===== PROOF GENERATION INPUT =====
  const secret = members[2]; // 33
  const leaf = Buffer.from(F.toString(poseidon([secret])));

  const proof = tree.getProof(leaf);

  const pathElements = proof.map((p) =>
    BigInt("0x" + p.data.toString("hex")).toString(),
  );

  const pathIndices = proof.map((p) => (p.position === "right" ? 1 : 0));

  // Pad to depth = 20
  while (pathElements.length < 20) {
    pathElements.push("0");
    pathIndices.push(0);
  }

  const input = {
    root: merkleRoot,
    secret: secret.toString(),
    pathElements,
    pathIndices,
  };

  fs.writeFileSync("input.json", JSON.stringify(input, null, 2));

  console.log("✅ input.json generated correctly");
  console.log("✅ artifacts/merkle.json saved");
})();
