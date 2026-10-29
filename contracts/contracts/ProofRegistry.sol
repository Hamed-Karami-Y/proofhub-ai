// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProofRegistry {
    struct Proof {
        bytes32 proofHash;
        address submitter;
        uint256 timestamp;
    }

    mapping(bytes32 => Proof) private proofs;

    event ProofRegistered(
        bytes32 indexed proofHash,
        address indexed submitter,
        uint256 timestamp
    );

    function registerProof(bytes32 proofHash) external {
        require(proofs[proofHash].timestamp == 0, "Proof already exists");

        proofs[proofHash] = Proof({
            proofHash: proofHash,
            submitter: msg.sender,
            timestamp: block.timestamp
        });

        emit ProofRegistered(
            proofHash,
            msg.sender,
            block.timestamp
        );
    }

    function verifyProof(bytes32 proofHash)
        external
        view
        returns (
            bool exists,
            address submitter,
            uint256 timestamp
        )
    {
        Proof memory proof = proofs[proofHash];

        if (proof.timestamp == 0) {
            return (false, address(0), 0);
        }

        return (
            true,
            proof.submitter,
            proof.timestamp
        );
    }
}