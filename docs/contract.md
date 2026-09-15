ProofHub AI Smart Contract

Contract

Proof Registry

The smart contract provides the on-chain registry for ProofHub AI proofs.

Network : Sepolia

Chain ID : 11155111

Responsibilities

The contract provides two primary operations:

Register Proof

	registerProof(bytes32 proofHash)
	
	Registers a proof hash on-chain.

Verify Proof

	verifyProof(bytes32 proofHash)

	Returns whether the proof exists and provides its associated submission information.
	

ProofRegistered Event

The contract emits a `ProofRegistered` event when a proof is registered.

Conceptually:


ProofRegistered
 ├── proofHash
 ├── submitter
 └── timestamp



On-Chain Data

The contract stores proof-related information required for verification.

It does not store:

* Original documents
* Full AI responses
* Private application data
* Sensitive user content

Only the cryptographic proof and the information required to verify its registration are anchored on-chain.

Verification Model :

Audit Record
     ↓
Proof Hash
     ↓
registerProof(bytes32)
     ↓
Sepolia
     ↓
verifyProof(bytes32)

The blockchain therefore acts as the immutable proof registry for the ProofHub AI audit workflow.
