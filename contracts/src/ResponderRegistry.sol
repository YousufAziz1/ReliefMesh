// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ResponderRegistry
 * @notice Virtual Responder Node registry for ReliefMesh on Creditcoin CC3.
 * @dev Manages responder identity, zone mapping, reputation score, and status.
 *      CLEAR NOTICE: These are virtual simulation deployment nodes, not physical DePIN devices.
 */
contract ResponderRegistry {
    struct Responder {
        address wallet;
        string nodeId;
        string serviceArea;
        string role;
        uint256 reputation;
        bool active;
        uint256 registrationTimestamp;
    }

    address public owner;
    uint256 public totalResponders;

    mapping(address => Responder) public responders;
    address[] public responderAddresses;

    event ResponderRegistered(
        address indexed wallet,
        string nodeId,
        string serviceArea,
        string role,
        uint256 timestamp
    );
    event ResponderDeactivated(address indexed wallet, uint256 timestamp);
    event ResponderReactivated(address indexed wallet, uint256 timestamp);
    event ReputationUpdated(address indexed wallet, uint256 newReputation);

    modifier onlyOwner() {
        require(msg.sender == owner, "ResponderRegistry: caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerResponder(
        address _wallet,
        string calldata _nodeId,
        string calldata _serviceArea,
        string calldata _role
    ) external onlyOwner {
        require(_wallet != address(0), "ResponderRegistry: zero address");
        require(bytes(_nodeId).length > 0, "ResponderRegistry: empty node ID");

        if (responders[_wallet].wallet == address(0)) {
            responderAddresses.push(_wallet);
            totalResponders += 1;
        }

        responders[_wallet] = Responder({
            wallet: _wallet,
            nodeId: _nodeId,
            serviceArea: _serviceArea,
            role: _role,
            reputation: 100, // baseline reputation score
            active: true,
            registrationTimestamp: block.timestamp
        });

        emit ResponderRegistered(_wallet, _nodeId, _serviceArea, _role, block.timestamp);
    }

    function deactivateResponder(address _wallet) external onlyOwner {
        require(responders[_wallet].wallet != address(0), "ResponderRegistry: not found");
        require(responders[_wallet].active, "ResponderRegistry: already inactive");

        responders[_wallet].active = false;
        emit ResponderDeactivated(_wallet, block.timestamp);
    }

    function reactivateResponder(address _wallet) external onlyOwner {
        require(responders[_wallet].wallet != address(0), "ResponderRegistry: not found");
        require(!responders[_wallet].active, "ResponderRegistry: already active");

        responders[_wallet].active = true;
        emit ResponderReactivated(_wallet, block.timestamp);
    }

    function updateReputation(address _wallet, uint256 _newReputation) external onlyOwner {
        require(responders[_wallet].wallet != address(0), "ResponderRegistry: not found");
        responders[_wallet].reputation = _newReputation;
        emit ReputationUpdated(_wallet, _newReputation);
    }

    function getResponder(address _wallet) external view returns (Responder memory) {
        require(responders[_wallet].wallet != address(0), "ResponderRegistry: not found");
        return responders[_wallet];
    }

    function getActiveResponders() external view returns (Responder[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < responderAddresses.length; i++) {
            if (responders[responderAddresses[i]].active) {
                activeCount++;
            }
        }

        Responder[] memory activeList = new Responder[](activeCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < responderAddresses.length; i++) {
            if (responders[responderAddresses[i]].active) {
                activeList[idx] = responders[responderAddresses[i]];
                idx++;
            }
        }

        return activeList;
    }

    function getAllResponderAddresses() external view returns (address[] memory) {
        return responderAddresses;
    }
}
