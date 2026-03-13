pragma circom 2.0.0;

include "poseidon.circom";

template MerkleProof(depth) {
    signal input leaf;
    signal input pathElements[depth];
    signal input pathIndices[depth]; 
    signal output outRoot;

    signal hash[depth + 1];
    hash[0] <== leaf;

    component selectors[depth];
    component hashers[depth];

    for (var i = 0; i < depth; i++) {
        hashers[i] = Poseidon(2);
        
        hashers[i].inputs[0] <== hash[i] + pathIndices[i] * (pathElements[i] - hash[i]);
        hashers[i].inputs[1] <== pathElements[i] + pathIndices[i] * (hash[i] - pathElements[i]);

        hash[i+1] <== hashers[i].out;
    }

    outRoot <== hash[depth];
}