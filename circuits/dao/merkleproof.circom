pragma circom 2.0.0;

include "poseidon.circom";

template MerkleProof(depth) {
    signal input leaf;
    signal input pathElements[depth];
    signal input pathIndices[depth]; // 0 = leaf is left, 1 = leaf is right
    signal output outRoot;

    signal hash[depth + 1];
    hash[0] <== leaf;

    component selectors[depth];
    component hashers[depth];

    for (var i = 0; i < depth; i++) {
        hashers[i] = Poseidon(2);

        // If pathIndices[i] is 0: hash(hash[i], pathElements[i])
        // If pathIndices[i] is 1: hash(pathElements[i], hash[i])
        
        // This logic replaces your term1..term4 with a standard conditional
        hashers[i].inputs[0] <== hash[i] + pathIndices[i] * (pathElements[i] - hash[i]);
        hashers[i].inputs[1] <== pathElements[i] + pathIndices[i] * (hash[i] - pathElements[i]);

        hash[i+1] <== hashers[i].out;
    }

    outRoot <== hash[depth];
}