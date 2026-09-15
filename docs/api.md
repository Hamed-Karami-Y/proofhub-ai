ProofHub AI API

Overview

The ProofHub AI backend exposes HTTP APIs for AI execution, audit records, blockchain confirmation, and verification.

Base URL:

https://api-proofhub-ai.yukaha.com


AI Generation

POST `/ai/generate`

Generates an AI audit result and creates the corresponding audit record.

Request :

json
{
  "walletAddress": "0x...",
  "prompt": "..."
}

The response contains the generated audit information, including the audit record identifier and proof hash.

Response :

{
  "recordId": " ",
  "proofHash": " ",
  "output": " ",
  "model": " ",
  "createdAt": " ",
  "status": 1
}


---

Blockchain Confirmation

POST `/ai/confirm`

Associates a confirmed blockchain transaction with an existing audit record.

Request :

json
{
  "recordId": "audit-record-id",
  "transactionHash": "0x...",
  "contractAddress": "0x29a9DD16831280E978822a3ba0a50f18aCEF3332"
}


Purpose :

{
  "success": true
}

This endpoint is called after the blockchain transaction has been successfully mined.

---

Get Audits

GET `/audit`

Returns available audit records.

The response includes audit information such as:

* Audit record ID
* Wallet address
* AI model
* Proof hash
* Timestamp
* Status
* Blockchain verification status
* Transaction hash

---

Verify Audit

POST `/audit/verify`

Verifies an audit proof against the backend audit record.

Request

json
{
  "proofHash": "..."
}


The result indicates whether the supplied proof matches the stored audit information.

Response :

{
  "valid": 
}

---

Audit by ID

GET `/audit/{id}`

Returns a specific audit record.

Response :

{
  "auditRecordId": " ",
  "walletAddress": " ",
  "model": " ",
  "modelVersion": " ",
  "promptHash": " ",
  "outputHash": " ",
  "proofHash": " ",
  "createdAt": " ",
  "status": 1,
  "blockchain":  ,
  "transactionHash": " ",
  "contractAddress": "0x29a9DD16831280E978822a3ba0a50f18aCEF3332",
  "blockNumber": null,
  "blockchainVerified": 
}
