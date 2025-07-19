// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }
    
    struct Voter {
        bool hasVoted;
        uint256 votedFor;
        bool isRegistered;
    }
    
    address public admin;
    string public adminPassword;
    bool public votingActive;
    uint256 public candidateCount;
    uint256 public totalVotes;
    
    mapping(uint256 => Candidate) public candidates;
    mapping(address => Voter) public voters;
    mapping(address => bool) public registeredVoters;
    
    event VoteCasted(address indexed voter, uint256 indexed candidateId);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VotingStarted();
    event VotingEnded();
    event VoterRegistered(address indexed voter);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier votingIsActive() {
        require(votingActive, "Voting is not active");
        _;
    }
    
    constructor(string memory _adminPassword) {
        admin = msg.sender;
        adminPassword = _adminPassword;
        votingActive = false;
        candidateCount = 0;
        totalVotes = 0;
    }
    
    function addCandidate(string memory _name) public onlyAdmin {
        require(!votingActive, "Cannot add candidates while voting is active");
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
        emit CandidateAdded(candidateCount, _name);
        candidateCount++;
    }
    
    function startVoting() public onlyAdmin {
        require(candidateCount > 0, "No candidates added");
        votingActive = true;
        emit VotingStarted();
    }
    
    function endVoting() public onlyAdmin {
        votingActive = false;
        emit VotingEnded();
    }
    
    function registerVoter(address _voter) public onlyAdmin {
        registeredVoters[_voter] = true;
        voters[_voter] = Voter(false, 0, true);
        emit VoterRegistered(_voter);
    }
    
    function registerMultipleVoters(address[] memory _voters) public onlyAdmin {
        for (uint256 i = 0; i < _voters.length; i++) {
            registeredVoters[_voters[i]] = true;
            voters[_voters[i]] = Voter(false, 0, true);
            emit VoterRegistered(_voters[i]);
        }
    }
    
    function vote(uint256 _candidateId) public votingIsActive {
        require(registeredVoters[msg.sender], "Voter not registered");
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(_candidateId < candidateCount, "Invalid candidate");
        
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedFor = _candidateId;
        candidates[_candidateId].voteCount++;
        totalVotes++;
        
        emit VoteCasted(msg.sender, _candidateId);
    }
    
    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter].hasVoted;
    }
    
    function getVoterInfo(address _voter) public view returns (bool hasVoted, uint256 votedFor, bool isRegistered) {
        Voter memory voter = voters[_voter];
        return (voter.hasVoted, voter.votedFor, voter.isRegistered);
    }
    
    function getCandidate(uint256 _candidateId) public view returns (uint256 id, string memory name, uint256 voteCount) {
        require(_candidateId < candidateCount, "Invalid candidate");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }
    
    function getCandidatesCount() public view returns (uint256) {
        return candidateCount;
    }
    
    function getTotalVotes() public view returns (uint256) {
        return totalVotes;
    }
    
    function isVotingActive() public view returns (bool) {
        return votingActive;
    }
    
    function isVoterRegistered(address _voter) public view returns (bool) {
        return registeredVoters[_voter];
    }
    
    // Admin functions with password verification
    function verifyAdminPassword(string memory _password) public view returns (bool) {
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(adminPassword));
    }
    
    function changeAdminPassword(string memory _oldPassword, string memory _newPassword) public onlyAdmin {
        require(keccak256(abi.encodePacked(_oldPassword)) == keccak256(abi.encodePacked(adminPassword)), "Incorrect password");
        adminPassword = _newPassword;
    }
    
    function transferAdmin(address _newAdmin, string memory _password) public onlyAdmin {
        require(keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(adminPassword)), "Incorrect password");
        admin = _newAdmin;
    }
    
    // Emergency functions
    function emergencyStop() public onlyAdmin {
        votingActive = false;
    }
    
    function getContractInfo() public view returns (
        address _admin,
        bool _votingActive,
        uint256 _candidateCount,
        uint256 _totalVotes
    ) {
        return (admin, votingActive, candidateCount, totalVotes);
    }
} 