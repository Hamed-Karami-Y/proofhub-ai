ProofHub AI Workflow

1. Wallet Connection

	The user connects a compatible Web3 wallet.

	The wallet address becomes the identity associated with the audit workflow.

2. Submit AI Request

	The user enters an AI audit prompt through the frontend.

	The request is sent to the backend.

3. AI Execution

	The backend sends the request to the configured AI provider.

	The AI provider generates the response.

4. Audit Record Creation

	The backend creates an audit record containing the execution information and associated metadata.

5. Proof Generation

	A cryptographic proof hash is generated for the audit record.

	The proof acts as the fingerprint of the recorded execution.

6. Persistence

	The audit record is stored in the backend database.

	The generated proof hash is associated with the audit record.

7. Blockchain Anchoring

	The user selects *Anchor to Web3*.

	The frontend submits the proof hash to the Proof Registry smart contract on Base Sepolia.

	The user confirms the transaction in the wallet.

8. Transaction Confirmation

	After the blockchain transaction is mined, the transaction hash is sent back to the backend.

	The audit record is updated with its blockchain confirmation information.

9. Verification

	A user can verify an audit using its proof hash.

	The system checks the backend audit record and the corresponding on-chain proof.

10. Result

	A successfully registered proof provides independently verifiable evidence that the recorded proof existed on-chain and has not been replaced by another proof.
