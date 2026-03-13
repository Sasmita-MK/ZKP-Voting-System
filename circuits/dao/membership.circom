pragma circom 2.0.0;

include "poseidon.circom";
include "merkleproof.circom";

template DAOMembership(depth) {
    signal input root;                   // Public Merkle root
    signal input secret;                 // User secret (private)
    signal input pathElements[depth];    // Merkle path elements
    signal input pathIndices[depth];     // Merkle path indices

    // 1. Hash the secret to get the leaf
    component leafHash = Poseidon(1);
    leafHash.inputs[0] <== secret;

    // 2. Calculate the Merkle Root from the leaf and the path
    component merkle = MerkleProof(depth);
    merkle.leaf <== leafHash.out;

    for (var i = 0; i < depth; i++) {
        merkle.pathElements[i] <== pathElements[i];
        merkle.pathIndices[i] <== pathIndices[i];
    }

    // 3. CRITICAL: Constraint
    // This forces the proof to fail if the calculated root != the public input root
    root === merkle.outRoot;
}

// 4. IMPORTANT: Define 'root' as PUBLIC so the Smart Contract can see it
component main {public [root]} = DAOMembership(20);