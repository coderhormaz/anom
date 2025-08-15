// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Confessions {
    struct Confession {
        string text;
        address wallet;
        uint256 timestamp;
        int256 votes;
        mapping(address => bool) voters;
    }

    Confession[] public confessions;

    event ConfessionPosted(uint256 id, string text, address indexed wallet, uint256 timestamp);
    event Voted(uint256 id, address indexed voter, int256 votes);

    function postConfession(string memory text) external {
        require(bytes(text).length > 0, "Confession cannot be empty");
        require(bytes(text).length <= 280, "Confession exceeds 280 characters");

        Confession storage newConfession = confessions.push();
        newConfession.text = text;
        newConfession.wallet = msg.sender;
        newConfession.timestamp = block.timestamp;
        newConfession.votes = 0;

        emit ConfessionPosted(confessions.length - 1, text, msg.sender, block.timestamp);
    }

    function upvote(uint256 id) external {
        require(id < confessions.length, "Invalid confession ID");
        Confession storage confession = confessions[id];
        require(!confession.voters[msg.sender], "You have already voted");

        confession.votes += 1;
        confession.voters[msg.sender] = true;

        emit Voted(id, msg.sender, confession.votes);
    }

    function downvote(uint256 id) external {
        require(id < confessions.length, "Invalid confession ID");
        Confession storage confession = confessions[id];
        require(!confession.voters[msg.sender], "You have already voted");

        confession.votes -= 1;
        confession.voters[msg.sender] = true;

        emit Voted(id, msg.sender, confession.votes);
    }

    function getConfessions() external view returns (Confession[] memory) {
        return confessions;
    }
}
