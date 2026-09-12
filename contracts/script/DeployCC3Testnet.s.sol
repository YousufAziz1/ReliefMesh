// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/ReliefCampaign.sol";
import "../src/AttestcoinDonationVerifier.sol";
import "../src/ResponderRegistry.sol";
import "../src/AidDeliveryEscrow.sol";
import "../src/AidPackageRegistry.sol";

interface Vm {
    function startBroadcast() external;
    function stopBroadcast() external;
}

/**
 * @title DeployCC3Testnet
 * @notice Foundry deployment script for ReliefMesh on Creditcoin CC3 Testnet.
 */
contract DeployCC3Testnet {
    Vm constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    function run() external {
        vm.startBroadcast();

        // 1. Deploy ResponderRegistry
        ResponderRegistry responderRegistry = new ResponderRegistry();

        // 2. Deploy ReliefCampaign (temporarily with address(0) authorized verifier)
        ReliefCampaign campaign = new ReliefCampaign(address(0));

        // 3. Deploy AttestcoinDonationVerifier linked to ReliefCampaign & Gluwa Precompile Oracle
        address attestcoinOracle = 0x0000000000000000000000000000000000000FD2;
        AttestcoinDonationVerifier verifier = new AttestcoinDonationVerifier(
            address(campaign),
            attestcoinOracle
        );

        // 4. Configure ReliefCampaign to authorize AttestcoinDonationVerifier
        campaign.setAuthorizedVerifier(address(verifier));

        // 5. Deploy AidDeliveryEscrow linked to ResponderRegistry
        AidDeliveryEscrow escrow = new AidDeliveryEscrow(address(responderRegistry));

        // 6. Deploy AidPackageRegistry
        AidPackageRegistry packageRegistry = new AidPackageRegistry();

        vm.stopBroadcast();
    }
}
