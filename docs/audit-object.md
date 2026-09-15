ProofHub AI Audit Object

Purpose

The Audit Object is the logical record created for an AI execution.

It represents the evidence associated with one AI audit workflow.

Main Fields

| Field                | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `auditRecordId`      | Unique identifier of the audit record                     |
| `walletAddress`      | Wallet associated with the audit                          |
| `model`              | AI model used for execution                               |
| `proofHash`          | Cryptographic fingerprint of the audit                    |
| `createdAt`          | Audit creation timestamp                                  |
| `status`             | Current audit status                                      |
| `blockchainVerified` | Indicates whether blockchain anchoring has been confirmed |
| `transactionHash`    | Blockchain transaction used to anchor the proof           |


Conceptual Structure

json
{
  "auditRecordId": "...",
  "walletAddress": "0x...",
  "model": "...",
  "proofHash": "...",
  "createdAt": "...",
  "status": 1,
  "blockchainVerified": false,
  "transactionHash": null
}


After blockchain anchoring:

json
{
  "auditRecordId": "...",
  "walletAddress": "0x...",
  "model": "...",
  "proofHash": "...",
  "createdAt": "...",
  "status": 1,
  "blockchainVerified": true,
  "transactionHash": "0x..."
}


Proof Hash

The `proofHash` is the cryptographic identifier used to connect the backend audit record with the blockchain proof.

The complete audit data is not stored on-chain.

The proof hash acts as the verifiable fingerprint of the recorded audit.