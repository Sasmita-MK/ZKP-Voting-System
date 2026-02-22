// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Verifier.sol";

contract DAOVoting {
    Groth16Verifier public verifier;

    // DAO Merkle root (membership)
    uint256 public merkleRoot;

    // Proposal structure
    struct Proposal {
        string description;
        uint256 voteCount;
        bool exists;
    }

    // proposalId => Proposal
    mapping(uint256 => Proposal) public proposals;

    // nullifierHash => used or not
    mapping(uint256 => bool) public nullifierUsed;

    event ProposalCreated(uint256 indexed proposalId, string description);
    event VoteCast(uint256 indexed proposalId, uint256 nullifierHash);

    constructor(address _verifier, uint256 _merkleRoot) {
        verifier = Groth16Verifier(_verifier);
        merkleRoot = _merkleRoot;
    }

    // Create a new proposal
    function createProposal(uint256 proposalId, string calldata description) external {
        require(!proposals[proposalId].exists, "Proposal already exists");

        proposals[proposalId] = Proposal({
            description: description,
            voteCount: 0,
            exists: true
        });

        emit ProposalCreated(proposalId, description);
    }

    /**
     * Vote using ZK proof
     *
     * publicSignals[0] = merkleRoot (from circuit)
     * nullifierHash = off-chain unique identifier
     */
    function vote(
        uint256 proposalId,
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[1] calldata publicSignals,
        uint256 nullifierHash
    ) external {
        require(proposals[proposalId].exists, "Invalid proposal");

        uint256 root = publicSignals[0];

        require(root == merkleRoot, "Invalid Merkle root");
        require(!nullifierUsed[nullifierHash], "Vote already cast");

        bool valid = verifier.verifyProof(a, b, c, publicSignals);
        require(valid, "Invalid ZK proof");

        nullifierUsed[nullifierHash] = true;
        proposals[proposalId].voteCount += 1;

        emit VoteCast(proposalId, nullifierHash);
    }

    function getVotes(uint256 proposalId) external view returns (uint256) {
        require(proposals[proposalId].exists, "Invalid proposal");
        return proposals[proposalId].voteCount;
    }
}
