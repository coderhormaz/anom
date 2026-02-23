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

    /// @dev A memory-safe view of a Confession (no mapping).
    struct ConfessionView {
        string text;
        address wallet;
        uint256 timestamp;
        int256 votes;
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

    function getConfessionCount() external view returns (uint256) {
        return confessions.length;
    }

    function getConfession(uint256 id) external view returns (ConfessionView memory) {
        require(id < confessions.length, "Invalid confession ID");
        Confession storage c = confessions[id];
        return ConfessionView({
            text: c.text,
            wallet: c.wallet,
            timestamp: c.timestamp,
            votes: c.votes
        });
    }

    function getConfessions() external view returns (ConfessionView[] memory) {
        ConfessionView[] memory views = new ConfessionView[](confessions.length);
        for (uint256 i = 0; i < confessions.length; i++) {
            Confession storage c = confessions[i];
            views[i] = ConfessionView({
                text: c.text,
                wallet: c.wallet,
                timestamp: c.timestamp,
                votes: c.votes
            });
        }
        return views;
    }

    function hasVoted(uint256 id, address voter) external view returns (bool) {
        require(id < confessions.length, "Invalid confession ID");
        return confessions[id].voters[voter];
    }
}
