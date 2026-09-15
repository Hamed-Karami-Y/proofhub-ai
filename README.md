ProofHub AI

Verifiable AI Audit Infrastructure

ProofHub AI is a verifiable AI audit infrastructure that creates tamper-proof cryptographic evidence for AI-driven workflows.

Instead of asking users to trust AI-generated results, ProofHub AI creates an audit record for each AI execution, generates cryptographic proofs, and anchors the proof on the blockchain.

This allows users and third parties to independently verify that a recorded AI result has not been altered after execution.

Don't Trust AI. Verify Every Decision.

Features

* AI Audit Trail
* Cryptographic Proof Generation
* Blockchain Anchoring
* On-Chain Proof Verification
* Wallet-Based Ownership
* AI Workflow Integrity

How It Works

User
 ↓
Wallet Connection
 ↓
AI Audit Request
 ↓
AI Provider
 ↓
Audit Record Generation
 ↓
Proof Hash
 ↓
Blockchain Anchoring
 ↓
Independent Verification


Tech Stack

Frontend

* React
* Vite
* Wagmi
* Viem

Backend

* ASP.NET Core
* Entity Framework Core
* SQL Server

AI

* Groq API
* AI model provider abstraction

Blockchain

* Solidity
* Base Sepolia
* Proof Registry Smart Contract

Core Concept

ProofHub AI does not store sensitive documents or AI responses directly on-chain.

Instead, the system creates an audit record containing information such as:

* Audit ID
* Input / prompt information
* AI model metadata
* Output information
* Cryptographic proof hash
* Timestamp
* Wallet address
* Blockchain transaction information

The proof hash is anchored on-chain through the Proof Registry smart contract.

Verification

A proof can be verified using its cryptographic proof hash.

The verification process checks:

1. The audit record.
2. The generated proof.
3. The blockchain record.
4. The existence of the registered proof on-chain.

This makes the result independently verifiable without exposing sensitive application data.

MVP Scope

Included

* Wallet connection
* AI audit request
* AI-generated result
* Audit record creation
* Cryptographic proof generation
* Proof hash
* Blockchain anchoring
* On-chain verification
* Audit history

Excluded from the current MVP

* Organization management
* Teams and roles
* Permission management
* Reputation systems
* Notifications
* Advanced analytics
* Multi-provider AI orchestration
* Public SDK
* Enterprise administration

Project Status

**Hackathon MVP — ChainHack 2026**

The current implementation is a functional proof-of-concept demonstrating the complete flow from AI execution to blockchain anchoring and verification.

Documentation

* [Architecture](./docs/architecture.md)
* [API](./docs/api.md)
* [Audit Object](./docs/audit-object.md)
* [Smart Contract](./docs/contract.md)
* [MVP Scope](./docs/mvp.md)
* [Workflow](./docs/workflow.md)
