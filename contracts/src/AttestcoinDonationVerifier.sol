// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IReliefCampaign {
    function recordVerifiedDonation(
        uint256 _campaignId,
        address _donor,
        uint256 _amount,
        bytes32 _sourceTxHash
    ) external;
}

/**
 * @title AttestcoinDonationVerifier
 * @notice Cross-chain proof verification bridge between Ethereum Sepolia and Creditcoin CC3.
 * @dev Validates Attestcoin inclusion proofs / attestations and updates ReliefCampaign.
 *      Enforces zero duplicate transactions and records full cryptographic evidence.
 */
contract AttestcoinDonationVerifier {
    struct DonationEvidence {
        string sourceChain;
        bytes32 sourceTxHash;
        uint256 sourceBlockNumber;
        address donor;
        uint256 amount;
        uint256 campaignId;
        uint256 verificationTimestamp;
        bytes attestationSignature;
    }

    address public owner;
    address public campaignContract;
    address public attestcoinOracle;

    // Mapping from sourceTxHash => verified
    mapping(bytes32 => bool) public verifiedTransactions;
    // Mapping from sourceTxHash => DonationEvidence
    mapping(bytes32 => DonationEvidence) public donationEvidence;

    event DonationProofVerified(
        bytes32 indexed sourceTxHash,
        string sourceChain,
        uint256 sourceBlockNumber,
        address indexed donor,
        uint256 amount,
        uint256 campaignId,
        uint256 timestamp
    );
    event DuplicateDonationRejected(bytes32 indexed sourceTxHash, address indexed submitter);
    event OracleUpdated(address indexed newOracle);
    event CampaignContractUpdated(address indexed newCampaign);

    modifier onlyOwner() {
        require(msg.sender == owner, "AttestcoinVerifier: caller is not owner");
        _;
    }

    constructor(address _campaignContract, address _attestcoinOracle) {
        owner = msg.sender;
        campaignContract = _campaignContract;
        attestcoinOracle = _attestcoinOracle;
    }

    function setCampaignContract(address _newCampaign) external onlyOwner {
        require(_newCampaign != address(0), "AttestcoinVerifier: zero address");
        campaignContract = _newCampaign;
        emit CampaignContractUpdated(_newCampaign);
    }

    function setAttestcoinOracle(address _newOracle) external onlyOwner {
        require(_newOracle != address(0), "AttestcoinVerifier: zero address");
        attestcoinOracle = _newOracle;
        emit OracleUpdated(_newOracle);
    }

    /**
     * @notice Verifies an Attestcoin proof of an Ethereum Sepolia donation transaction.
     * @param _sourceChain Name of the source network (e.g. "Ethereum Sepolia")
     * @param _sourceTxHash Transaction hash on Ethereum Sepolia
     * @param _sourceBlockNumber Block number on source chain
     * @param _donor Address of the donor
     * @param _amount Amount donated in testnet units (18 decimals)
     * @param _campaignId Target ReliefMesh campaign ID
     * @param _attestationSignature Cryptographic attestation signature from Attestcoin BlockProver/Oracle
     */
    function verifyDonationProof(
        string calldata _sourceChain,
        bytes32 _sourceTxHash,
        uint256 _sourceBlockNumber,
        address _donor,
        uint256 _amount,
        uint256 _campaignId,
        bytes calldata _attestationSignature
    ) external returns (bool) {
        // Duplicate transaction protection
        if (verifiedTransactions[_sourceTxHash]) {
            emit DuplicateDonationRejected(_sourceTxHash, msg.sender);
            revert("AttestcoinVerifier: duplicate source transaction");
        }

        require(_sourceTxHash != bytes32(0), "AttestcoinVerifier: invalid tx hash");
        require(_amount > 0, "AttestcoinVerifier: amount must be > 0");
        require(_donor != address(0), "AttestcoinVerifier: invalid donor");
        require(_sourceBlockNumber > 0, "AttestcoinVerifier: invalid block number");

        // Attestation signature verification
        if (attestcoinOracle != address(0)) {
            bytes32 proofHash = keccak256(
                abi.encodePacked(
                    _sourceChain,
                    _sourceTxHash,
                    _sourceBlockNumber,
                    _donor,
                    _amount,
                    _campaignId
                )
            );
            bytes32 ethSignedMessageHash = keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", proofHash)
            );
            address recoveredSigner = recoverSigner(ethSignedMessageHash, _attestationSignature);
            require(
                recoveredSigner == attestcoinOracle || recoveredSigner == owner,
                "AttestcoinVerifier: invalid attestation signature"
            );
        }

        // Record verification evidence
        verifiedTransactions[_sourceTxHash] = true;
        donationEvidence[_sourceTxHash] = DonationEvidence({
            sourceChain: _sourceChain,
            sourceTxHash: _sourceTxHash,
            sourceBlockNumber: _sourceBlockNumber,
            donor: _donor,
            amount: _amount,
            campaignId: _campaignId,
            verificationTimestamp: block.timestamp,
            attestationSignature: _attestationSignature
        });

        // Update campaign accounting on Creditcoin CC3
        if (campaignContract != address(0)) {
            IReliefCampaign(campaignContract).recordVerifiedDonation(
                _campaignId,
                _donor,
                _amount,
                _sourceTxHash
            );
        }

        emit DonationProofVerified(
            _sourceTxHash,
            _sourceChain,
            _sourceBlockNumber,
            _donor,
            _amount,
            _campaignId,
            block.timestamp
        );

        return true;
    }

    function isDonationVerified(bytes32 _sourceTxHash) external view returns (bool) {
        return verifiedTransactions[_sourceTxHash];
    }

    function getDonationEvidence(bytes32 _sourceTxHash) external view returns (DonationEvidence memory) {
        require(verifiedTransactions[_sourceTxHash], "AttestcoinVerifier: not verified");
        return donationEvidence[_sourceTxHash];
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _sig) internal pure returns (address) {
        if (_sig.length != 65) {
            return address(0);
        }

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(_sig, 32))
            s := mload(add(_sig, 64))
            v := byte(0, mload(add(_sig, 96)))
        }

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }
}
