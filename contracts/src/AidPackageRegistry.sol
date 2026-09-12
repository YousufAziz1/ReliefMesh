// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AidPackageRegistry
 * @notice On-chain inventory of simulated humanitarian aid packages.
 * @dev DISCLAIMER: These are RWA representations and digital inventory accounting records.
 *      They DO NOT represent physical delivery guarantees or legal claims over real physical goods.
 */
contract AidPackageRegistry {
    enum PackageStatus { Queued, Dispatched, Delivered, Audited }

    struct AidPackage {
        uint256 packageId;
        uint256 campaignId;
        string assetType;     // "Water Kit", "Medical Kit", "Food Package"
        string zone;          // e.g. "Brahmaputra North - Zone A"
        PackageStatus status;
        bytes32 deliveryProofHash;
        uint256 createdAt;
        uint256 deliveredAt;
        string disclaimer;
    }

    address public owner;
    uint256 public nextPackageId = 1;

    mapping(uint256 => AidPackage) public packages;
    uint256[] public packageIds;

    event AidPackageCreated(uint256 indexed packageId, uint256 indexed campaignId, string assetType, string zone);
    event AidPackageStatusUpdated(uint256 indexed packageId, PackageStatus status, bytes32 proofHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "AidPackageRegistry: caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        string memory notice = "TESTNET SIMULATION ONLY - NOT A CLAIM ON PHYSICAL GOODS";

        // Pre-populate initial demo packages matching Stitch design
        _createPackage(1, "Water Kit", "Brahmaputra North - Sector 1", notice);
        _createPackage(1, "Medical Kit", "Guwahati Sector 4 - Mobile Post", notice);
        _createPackage(1, "Food Package", "Silchar East - Distribution Point C", notice);
    }

    function createPackage(
        uint256 _campaignId,
        string calldata _assetType,
        string calldata _zone
    ) external onlyOwner returns (uint256) {
        return _createPackage(_campaignId, _assetType, _zone, "TESTNET SIMULATION ONLY - NOT A CLAIM ON PHYSICAL GOODS");
    }

    function _createPackage(
        uint256 _campaignId,
        string memory _assetType,
        string memory _zone,
        string memory _disclaimer
    ) internal returns (uint256) {
        uint256 pkgId = nextPackageId++;
        packages[pkgId] = AidPackage({
            packageId: pkgId,
            campaignId: _campaignId,
            assetType: _assetType,
            zone: _zone,
            status: PackageStatus.Queued,
            deliveryProofHash: bytes32(0),
            createdAt: block.timestamp,
            deliveredAt: 0,
            disclaimer: _disclaimer
        });
        packageIds.push(pkgId);

        emit AidPackageCreated(pkgId, _campaignId, _assetType, _zone);
        return pkgId;
    }

    function markDelivered(uint256 _packageId, bytes32 _proofHash) external onlyOwner {
        AidPackage storage pkg = packages[_packageId];
        require(pkg.packageId != 0, "AidPackageRegistry: does not exist");
        require(pkg.status != PackageStatus.Delivered, "AidPackageRegistry: already delivered");

        pkg.status = PackageStatus.Delivered;
        pkg.deliveryProofHash = _proofHash;
        pkg.deliveredAt = block.timestamp;

        emit AidPackageStatusUpdated(_packageId, PackageStatus.Delivered, _proofHash);
    }

    function getPackage(uint256 _packageId) external view returns (AidPackage memory) {
        require(packages[_packageId].packageId != 0, "AidPackageRegistry: does not exist");
        return packages[_packageId];
    }

    function getAllPackages() external view returns (AidPackage[] memory) {
        AidPackage[] memory list = new AidPackage[](packageIds.length);
        for (uint256 i = 0; i < packageIds.length; i++) {
            list[i] = packages[packageIds[i]];
        }
        return list;
    }
}
