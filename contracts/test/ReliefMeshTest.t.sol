// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/ReliefCampaign.sol";
import "../src/AttestcoinDonationVerifier.sol";
import "../src/ResponderRegistry.sol";
import "../src/AidDeliveryEscrow.sol";
import "../src/AidPackageRegistry.sol";

/**
 * @title ReliefMeshContractTest
 * @notice Foundry test suite for ReliefMesh smart contracts.
 */
contract ReliefMeshContractTest {
    ReliefCampaign public campaign;
    AttestcoinDonationVerifier public verifier;
    ResponderRegistry public responderRegistry;
    AidDeliveryEscrow public escrow;
    AidPackageRegistry public packageRegistry;

    address public owner = address(this);
    address public donor = address(0x1111);
    address public responder1 = address(0x2222);

    function setUp() public {
        campaign = new ReliefCampaign(address(0));
        verifier = new AttestcoinDonationVerifier(address(campaign), address(0));
        campaign.setAuthorizedVerifier(address(verifier));

        responderRegistry = new ResponderRegistry();
        escrow = new AidDeliveryEscrow(address(responderRegistry));
        packageRegistry = new AidPackageRegistry();

        responderRegistry.registerResponder(responder1, "NODE-ALPHA", "Brahmaputra North", "Water Distribution");
    }

    function testCampaignCreation() public {
        uint256 cid = campaign.createCampaign("Assam Flood Test", 500 ether);
        (uint256 id, string memory name, uint256 goal, , , ) = campaign.getCampaignStats(cid);
        require(id == cid, "Invalid ID");
        require(goal == 500 ether, "Invalid goal");
        require(bytes(name).length > 0, "Empty name");
    }

    function testVerifiedDonationAndDuplicateRejection() public {
        bytes32 txHash = keccak256("sepolia_tx_001");
        
        // Record donation through verifier
        bool ok = verifier.verifyDonationProof("Ethereum Sepolia", txHash, 6841209, donor, 50 ether, 1, "");
        require(ok, "Verification failed");
        require(verifier.isDonationVerified(txHash), "Not verified");

        // Attempt duplicate donation
        try verifier.verifyDonationProof("Ethereum Sepolia", txHash, 6841209, donor, 50 ether, 1, "") {
            revert("Duplicate should have reverted");
        } catch {
            // Success: Duplicate correctly reverted!
        }
    }

    function testResponderRegistrationAndDeactivation() public {
        address newResponder = address(0x3333);
        responderRegistry.registerResponder(newResponder, "NODE-BETA", "Guwahati", "Medical");
        
        ResponderRegistry.Responder memory r = responderRegistry.getResponder(newResponder);
        require(r.active, "Should be active");

        responderRegistry.deactivateResponder(newResponder);
        r = responderRegistry.getResponder(newResponder);
        require(!r.active, "Should be inactive");
    }

    function testDeliveryTaskAndDuplicateClaimRejection() public {
        uint256 taskId = escrow.createDeliveryTask(1, responder1, 10 ether, "200 Water Kits");
        bytes32 proofHash = keccak256("delivery_proof_001");

        // Submit proof
        escrow.submitDeliveryProof(taskId, proofHash, "ipfs://evidence-001");
        
        // Approve delivery
        escrow.approveDelivery(taskId);

        // Attempt duplicate proof submission on another task
        uint256 task2 = escrow.createDeliveryTask(1, responder1, 10 ether, "Task 2");
        try escrow.submitDeliveryProof(task2, proofHash, "ipfs://evidence-001") {
            revert("Duplicate proof should revert");
        } catch {
            // Success: Duplicate proof hash rejected!
        }
    }

    function testAidPackageCreationAndDelivery() public {
        uint256 pkgId = packageRegistry.createPackage(1, "Water Kit", "Sector 1");
        bytes32 proofHash = keccak256("pkg_proof_001");

        packageRegistry.markDelivered(pkgId, proofHash);
        AidPackageRegistry.AidPackage memory p = packageRegistry.getPackage(pkgId);
        require(p.status == AidPackageRegistry.PackageStatus.Delivered, "Not delivered");
        require(p.deliveryProofHash == proofHash, "Hash mismatch");
    }
}
