// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSys {
    struct Candidate {
        string name;
        string party;
        uint votes;
    }

    address public owner;
    mapping(address => bool) public officials;
    Candidate[] public candidates;

    uint public startDate;
    uint public endDate;

    mapping(address => bool) public hasVoted;
    address[] public votersList; // Track all voters for reset functionality

    constructor() {
        owner = msg.sender;
        officials[msg.sender] = true;
    }

    modifier onlyOfficial() {
        require(officials[msg.sender], "Not an official");
        _;
    }

    modifier electionActive() {
        require(
            block.timestamp >= startDate && block.timestamp <= endDate,
            "Election not active"
        );
        _;
    }

    function registerCandidate(
        string memory _name,
        string memory _party
    ) external onlyOfficial {
        candidates.push(Candidate(_name, _party, 0));
    }

    function setElectionDates(uint _start, uint _end) external onlyOfficial {
        require(_start < _end, "Invalid dates");
        startDate = _start;
        endDate = _end;
    }

    function vote(uint _candidateIndex) external electionActive {
        require(!hasVoted[msg.sender], "Already voted");
        require(_candidateIndex < candidates.length, "Invalid candidate");

        candidates[_candidateIndex].votes += 1;
        hasVoted[msg.sender] = true;

        // Track voter for reset functionality
        votersList.push(msg.sender);
    }

    // New function: Reset election - clears all candidates, votes, and voting records
    function resetElection() external onlyOfficial {
        // Clear all candidates
        delete candidates;

        // Reset all voters' voting status
        for (uint i = 0; i < votersList.length; i++) {
            hasVoted[votersList[i]] = false;
        }

        // Clear voters list
        delete votersList;

        // Reset election dates
        startDate = 0;
        endDate = 0;
    }

    // New function: Remove specific candidate (alternative to full reset)
    function removeCandidate(uint _candidateIndex) external onlyOfficial {
        require(_candidateIndex < candidates.length, "Invalid candidate index");

        // Move the last candidate to the deleted position
        candidates[_candidateIndex] = candidates[candidates.length - 1];

        // Remove the last candidate
        candidates.pop();
    }

    // Return separate arrays to avoid Web3 decoding errors
    function getCandidates()
        external
        view
        returns (
            string[] memory names,
            string[] memory parties,
            uint[] memory votes
        )
    {
        names = new string[](candidates.length);
        parties = new string[](candidates.length);
        votes = new uint[](candidates.length);

        for (uint i = 0; i < candidates.length; i++) {
            names[i] = candidates[i].name;
            parties[i] = candidates[i].party;
            votes[i] = candidates[i].votes;
        }
    }

    // Get total number of candidates
    function getCandidateCount() external view returns (uint) {
        return candidates.length;
    }

    // Get total number of votes cast
    function getTotalVotes() external view returns (uint) {
        return votersList.length;
    }
}