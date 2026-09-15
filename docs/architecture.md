ProofHub AI Architecture

Overview

ProofHub AI consists of five main layers:

* Frontend
* Backend API
* AI Provider
* Proof / Audit Layer
* Blockchain

Components

Frontend

React-based web application responsible for:

* Wallet connection
* AI audit submission
* Displaying audit results
* Triggering blockchain anchoring
* Viewing audit history
* Proof verification

Backend

ASP.NET Core API responsible for:

* Receiving AI audit requests
* Executing the AI workflow
* Creating audit records
* Generating cryptographic proof data
* Persisting audit records
* Confirming blockchain transactions
* Providing audit and verification APIs

AI Provider

The AI layer is responsible for processing the submitted prompt and generating the AI response.

The current MVP uses Groq as the AI provider.


Audit / Proof Layer

The proof layer transforms the AI execution into a verifiable audit record.

It associates the execution with:

* Audit ID
* Wallet address
* AI model metadata
* Timestamp
* AI execution data
* Proof hash


Smart Contract

The Proof Registry smart contract is deployed on Base Sepolia.

Its responsibility is to register and verify proof hashes on-chain.

The blockchain stores the cryptographic proof rather than the complete AI data.

Data Flow

Frontend
   ↓
ASP.NET Core API
   ↓
AI Provider
   ↓
Audit / Proof Engine
   ↓
Database
   ↓
Proof Hash
   ↓
Proof Registry Contract
   ↓
Base Sepolia
   ↓
Verification
