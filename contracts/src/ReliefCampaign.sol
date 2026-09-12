// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReliefCampaign
 * @notice Core accounting and campaign lifecycle registry for ReliefMesh on Creditcoin CC3.
 * @dev All amounts are in testnet units (e.g. tCTC). This is a testnet simulation protocol.
 */
contract ReliefCampaign {
    struct Campaign {
        uint256 id;
        string name;
        uint256 goal;
        uint256 verifiedDonationAmount;
        uint256 donorCount;
        uint256 createdTimestamp;
        bool closed;
    }

    address public owner;
    address public authorizedVerifier;
    uint256 public nextCampaignId = 1;

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => bool)) public hasDonated;

    event CampaignCreated(uint256 indexed campaignId, string name, uint256 goal, uint256 timestamp);
    event DonationVerified(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount,
        bytes32 sourceTxHash,
        uint256 timestamp
    );
    event CampaignClosed(uint256 indexed campaignId, uint256 timestamp);
    event VerifierUpdated(address indexed newVerifier);

    modifier onlyOwner() {
        require(msg.sender == owner, "ReliefCampaign: caller is not owner");
        _;
    }

    modifier onlyVerifier() {
        require(
            msg.sender == authorizedVerifier || msg.sender == owner,
            "ReliefCampaign: caller is not authorized verifier"
        );
        _;
    }

    constructor(address _authorizedVerifier) {
        owner = msg.sender;
        authorizedVerifier = _authorizedVerifier;

        // Initialize default demo campaign: Assam Flood Relief — Testnet Simulation
        _createCampaign("Assam Flood Relief \u2014 Testnet Simulation", 1000 ether);
    }

    function setAuthorizedVerifier(address _newVerifier) external onlyOwner {
        require(_newVerifier != address(0), "ReliefCampaign: zero address");
        authorizedVerifier = _newVerifier;
        emit VerifierUpdated(_newVerifier);
    }

    function createCampaign(string calldata _name, uint256 _goal) external onlyOwner returns (uint256) {
        return _createCampaign(_name, _goal);
    }

    function _createCampaign(string memory _name, uint256 _goal) internal returns (uint256) {
        require(bytes(_name).length > 0, "ReliefCampaign: name cannot be empty");
        require(_goal > 0, "ReliefCampaign: goal must be greater than 0");

        uint256 campaignId = nextCampaignId++;
        campaigns[campaignId] = Campaign({
            id: campaignId,
            name: _name,
            goal: _goal,
            verifiedDonationAmount: 0,
            donorCount: 0,
            createdTimestamp: block.timestamp,
            closed: false
        });

        emit CampaignCreated(campaignId, _name, _goal, block.timestamp);
        return campaignId;
    }

    function recordVerifiedDonation(
        uint256 _campaignId,
        address _donor,
        uint256 _amount,
        bytes32 _sourceTxHash
    ) external onlyVerifier {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.id != 0, "ReliefCampaign: campaign does not exist");
        require(!campaign.closed, "ReliefCampaign: campaign is closed");
        require(_amount > 0, "ReliefCampaign: amount must be > 0");

        campaign.verifiedDonationAmount += _amount;

        if (!hasDonated[_campaignId][_donor]) {
            hasDonated[_campaignId][_donor] = true;
            campaign.donorCount += 1;
        }

        emit DonationVerified(_campaignId, _donor, _amount, _sourceTxHash, block.timestamp);
    }

    function closeCampaign(uint256 _campaignId) external onlyOwner {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.id != 0, "ReliefCampaign: campaign does not exist");
        require(!campaign.closed, "ReliefCampaign: already closed");

        campaign.closed = true;
        emit CampaignClosed(_campaignId, block.timestamp);
    }

    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        require(campaigns[_campaignId].id != 0, "ReliefCampaign: campaign does not exist");
        return campaigns[_campaignId];
    }

    function getCampaignStats(uint256 _campaignId)
        external
        view
        returns (
            uint256 id,
            string memory name,
            uint256 goal,
            uint256 verifiedAmount,
            uint256 donorCount,
            bool closed
        )
    {
        Campaign storage c = campaigns[_campaignId];
        require(c.id != 0, "ReliefCampaign: campaign does not exist");
        return (c.id, c.name, c.goal, c.verifiedDonationAmount, c.donorCount, c.closed);
    }
}
