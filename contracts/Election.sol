pragma solidity >=0.5.16;

contract Election{
    bool public flag;
    struct Candidate{
        uint c_id;
        uint c_votecount;
        string c_name;

    }
    uint public candidate_count;
    mapping(uint=>Candidate) public list_of_candidates;
    mapping(address=>bool) public list_of_voters;
    constructor () public{
        flag=false;
    }
    function addCandidate(string memory name) public {
        candidate_count+=1;
        list_of_candidates[candidate_count]=Candidate(candidate_count,0,name);
    }

    function voteCandidate(uint id) public {
        require(list_of_voters[msg.sender]==false);
        require(id<=candidate_count && id >=1);
        list_of_candidates[id].c_votecount+=1 ;
        list_of_voters[msg.sender]=true;
    }
    function toggleFlag() public{
        flag=!flag;
    }
}