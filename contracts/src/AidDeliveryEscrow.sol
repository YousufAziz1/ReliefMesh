// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IResponderRegistry {
    struct Responder {
        address wallet;
        string nodeId;
        string serviceArea;
        string role;
        uint256 reputation;
        bool active;
        uint256 registrationTimestamp;
    }

    function getResponder(address _wallet) external view returns (Responder memory);
}

/**
 * @title AidDeliveryEscrow
 * @notice Verifiable milestone task escrow and testnet reward dispatcher for ReliefMesh.
 * @dev Enforces delivery proof validation, duplicate claim rejection, and bounded testnet payouts.
 */
contract AidDeliveryEscrow {
    enum DeliveryStatus { Created, ProofSubmitted, Approved, Completed, Rejected }

    struct DeliveryTask {
        uint256 taskId;
        uint256 campaignId;
        address responder;
        string description;
        uint256 rewardAmount; // in testnet tCTC wei
        bytes32 proofHash;
        string evidenceUri;
        DeliveryStatus status;
        uint256 createdTimestamp;
        uint256 completedTimestamp;
        bool rewardReleased;
    }

    address public owner;
    address public responderRegistry;
    uint256 public nextTaskId = 1;

    mapping(uint256 => DeliveryTask) public deliveryTasks;
    mapping(bytes32 => bool) public usedProofHashes;

    event DeliveryTaskCreated(
        uint256 indexed taskId,
        uint256 indexed campaignId,
        address indexed responder,
        uint256 rewardAmount,
        string description
    );
    event DeliveryProofSubmitted(uint256 indexed taskId, bytes32 indexed proofHash, string evidenceUri);
    event DeliveryApproved(uint256 indexed taskId, address indexed approver);
    event ResponderRewardReleased(uint256 indexed taskId, address indexed responder, uint256 amount);
    event DuplicateClaimRejected(uint256 indexed taskId, bytes32 indexed proofHash, address submitter);
    event EscrowFunded(uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "AidDeliveryEscrow: caller is not owner");
        _;
    }

    constructor(address _responderRegistry) {
        owner = msg.sender;
        responderRegistry = _responderRegistry;
    }

    function setResponderRegistry(address _registry) external onlyOwner {
        require(_registry != address(0), "AidDeliveryEscrow: zero address");
        responderRegistry = _registry;
    }

    // Accept testnet funds into escrow
    receive() external payable {
        emit EscrowFunded(msg.value);
    }

    function createDeliveryTask(
        uint256 _campaignId,
        address _responder,
        uint256 _rewardAmount,
        string calldata _description
    ) external onlyOwner returns (uint256) {
        require(_responder != address(0), "AidDeliveryEscrow: zero address");
        require(_rewardAmount > 0, "AidDeliveryEscrow: reward must be > 0");

        if (responderRegistry != address(0)) {
            IResponderRegistry.Responder memory r = IResponderRegistry(responderRegistry).getResponder(_responder);
            require(r.active, "AidDeliveryEscrow: responder is not active");
        }

        uint256 taskId = nextTaskId++;
        deliveryTasks[taskId] = DeliveryTask({
            taskId: taskId,
            campaignId: _campaignId,
            responder: _responder,
            description: _description,
            rewardAmount: _rewardAmount,
            proofHash: bytes32(0),
            evidenceUri: "",
            status: DeliveryStatus.Created,
            createdTimestamp: block.timestamp,
            completedTimestamp: 0,
            rewardReleased: false
        });

        emit DeliveryTaskCreated(taskId, _campaignId, _responder, _rewardAmount, _description);
        return taskId;
    }

    function submitDeliveryProof(
        uint256 _taskId,
        bytes32 _proofHash,
        string calldata _evidenceUri
    ) external {
        DeliveryTask storage task = deliveryTasks[_taskId];
        require(task.taskId != 0, "AidDeliveryEscrow: task does not exist");
        require(msg.sender == task.responder || msg.sender == owner, "AidDeliveryEscrow: unauthorized");
        require(task.status == DeliveryStatus.Created, "AidDeliveryEscrow: invalid state");

        // Duplicate proof hash rejection
        if (usedProofHashes[_proofHash]) {
            emit DuplicateClaimRejected(_taskId, _proofHash, msg.sender);
            revert("AidDeliveryEscrow: duplicate delivery proof hash");
        }

        require(_proofHash != bytes32(0), "AidDeliveryEscrow: empty proof hash");
        require(bytes(_evidenceUri).length > 0, "AidDeliveryEscrow: missing evidence URI");

        usedProofHashes[_proofHash] = true;
        task.proofHash = _proofHash;
        task.evidenceUri = _evidenceUri;
        task.status = DeliveryStatus.ProofSubmitted;

        emit DeliveryProofSubmitted(_taskId, _proofHash, _evidenceUri);
    }

    function approveDelivery(uint256 _taskId) external onlyOwner {
        DeliveryTask storage task = deliveryTasks[_taskId];
        require(task.taskId != 0, "AidDeliveryEscrow: task does not exist");
        require(task.status == DeliveryStatus.ProofSubmitted, "AidDeliveryEscrow: proof not submitted");

        task.status = DeliveryStatus.Approved;
        emit DeliveryApproved(_taskId, msg.sender);

        // Automatically release reward upon approval
        _releaseReward(_taskId);
    }

    function releaseReward(uint256 _taskId) external onlyOwner {
        _releaseReward(_taskId);
    }

    function _releaseReward(uint256 _taskId) internal {
        DeliveryTask storage task = deliveryTasks[_taskId];
        require(task.taskId != 0, "AidDeliveryEscrow: task does not exist");
        require(task.status == DeliveryStatus.Approved, "AidDeliveryEscrow: task not approved");
        require(!task.rewardReleased, "AidDeliveryEscrow: reward already released");

        // Verify responder active status
        if (responderRegistry != address(0)) {
            IResponderRegistry.Responder memory r = IResponderRegistry(responderRegistry).getResponder(task.responder);
            require(r.active, "AidDeliveryEscrow: responder is no longer active");
        }

        task.rewardReleased = true;
        task.status = DeliveryStatus.Completed;
        task.completedTimestamp = block.timestamp;

        // Bounded testnet transfer if contract is funded
        if (address(this).balance >= task.rewardAmount) {
            (bool sent, ) = payable(task.responder).call{value: task.rewardAmount}("");
            require(sent, "AidDeliveryEscrow: failed to send testnet reward");
        }

        emit ResponderRewardReleased(_taskId, task.responder, task.rewardAmount);
    }

    function getTask(uint256 _taskId) external view returns (DeliveryTask memory) {
        require(deliveryTasks[_taskId].taskId != 0, "AidDeliveryEscrow: task does not exist");
        return deliveryTasks[_taskId];
    }
}
