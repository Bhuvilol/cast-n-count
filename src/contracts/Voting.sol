
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }
    
    mapping(address => bool) public voters;
    Candidate[] public candidates;
    uint256 public candidatesCount;
    
    event VoteCasted(address indexed voter, uint256 indexed candidateId);
    
    constructor(string[] memory candidateNames) {
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                id: i,
                name: candidateNames[i],
                voteCount: 0
            }));
            candidatesCount++;
        }
    }
    
    function vote(uint256 _candidateId) external {
        require(!voters[msg.sender], "Already voted");
        require(_candidateId < candidatesCount, "Invalid candidate");
        
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        
        emit VoteCasted(msg.sender, _candidateId);
    }
    
    function getCandidate(uint256 _candidateId) external view 
        returns (uint256, string memory, uint256) 
    {
        require(_candidateId < candidatesCount, "Invalid candidate");
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.voteCount);
    }
    
    function getCandidatesCount() external view returns (uint256) {
        return candidatesCount;
    }
    
    function hasVoted(address _voter) external view returns (bool) {
        return voters[_voter];
    }
}
