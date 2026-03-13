// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Verifier.sol";

contract DAOVoting {
    Groth16Verifier public verifier;
    uint256 public merkleRoot;
    address public admin;

    struct Proposal {
        string title;
        string description;
        uint256 endTime;
        bool exists;
        // Mapping of Option Index => Vote Count
        mapping(uint256 => uint256) optionVotes; 
        uint256 totalVotes;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => bool) public nullifierUsed;

    event ProposalCreated(uint256 proposalId, string title);
    event VoteCasted(uint256 proposalId, uint256 optionIndex);

    constructor(address _verifier, uint256 _merkleRoot) {
        verifier = Groth16Verifier(_verifier);
        merkleRoot = _merkleRoot;
        admin = msg.sender;
    }

    function createProposal(uint256 proposalId, string calldata _title, string calldata _description, uint256 _endTime) external {
        require(msg.sender == admin, "Unauthorized");
        Proposal storage p = proposals[proposalId];
        p.title = _title;
        p.description = _description;
        p.endTime = _endTime;
        p.exists = true;
        emit ProposalCreated(proposalId, _title);
    }

    // Added _optionIndex to the parameters
    function vote(
        uint256 proposalId,
        uint256 _optionIndex,
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[1] calldata publicSignals,
        uint256 nullifierHash
    ) external {
        require(proposals[proposalId].exists, "Invalid proposal");
        require(block.timestamp < proposals[proposalId].endTime, "Closed");
        require(!nullifierUsed[nullifierHash], "Already voted");
        require(verifier.verifyProof(a, b, c, publicSignals), "Invalid proof");

        nullifierUsed[nullifierHash] = true;
        proposals[proposalId].optionVotes[_optionIndex] += 1;
        proposals[proposalId].totalVotes += 1;

        emit VoteCasted(proposalId, _optionIndex);
    }

    // Helper to get votes for a specific option
    function getOptionVotes(uint256 proposalId, uint256 optionIndex) external view returns (uint256) {
        return proposals[proposalId].optionVotes[optionIndex];
    }
}