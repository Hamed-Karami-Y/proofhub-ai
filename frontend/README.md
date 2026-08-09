# ProofHub AI — AI Audit Infrastructure

**ProofHub AI** is a Web3 AI Audit Infrastructure designed to create verifiable proof for AI workflows. Rather than storing large AI data on-chain, ProofHub AI creates cryptographic proof hashes of AI execution parameters, prompts, and outputs, anchoring them onto an Ethereum smart contract (`ProofRegistry.sol`).

---

## 🚀 Quick Start & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set the following variables in `.env`:

```env
# Backend API URL (Default to relative /api)
VITE_API_URL=http://localhost:3000/api

# Smart Contract Address for ProofRegistry
VITE_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678

# Ethereum Chain ID (11155111 for Sepolia, 1 for Mainnet, 31337 for Hardhat)
VITE_CHAIN_ID=11155111

# Optional Gemini API Key for AI Audit Response generation
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be running on `http://localhost:3000`.

---

## 📜 Smart Contract Specification

### `ProofRegistry.sol`

```solidity
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
```

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── Navbar.jsx          # Top navigation & brand header
│   ├── WalletConnect.jsx   # MetaMask wallet connection & status dropdown
│   ├── AuditCard.jsx       # Reusable card component for audit proofs
│   └── Loading.jsx         # Custom Web3 loading spinner
├── pages/
│   ├── Home.jsx            # Landing page ("Don't Trust AI. Verify Every Decision.")
│   ├── Dashboard.jsx       # Overview stats, wallet address, & recent audits
│   ├── CreateAudit.jsx     # AI prompt input, response generation, & proof creator
│   ├── AuditHistory.jsx    # Table view of previous audits & proof ledger
│   └── VerifyAudit.jsx     # Query & verification of audit proofs
├── services/
│   ├── api.js              # Axios service for backend API endpoints
│   └── blockchain.js       # viem / wagmi smart contract service
├── hooks/
│   └── useWallet.js        # Reusable wallet & writeContract hook wrapper
├── config/
│   ├── contract.js         # Contract address, chain ID, and ABI definitions
│   └── wagmi.js            # Wagmi config & connectors setup
└── utils/
    └── format.js           # Address formatting, date formatting, & clipboard helpers
```

---

## 🔌 API Endpoints

- **`POST /api/audit/create`**: Submits prompt, returns AI analysis and cryptographic `proofHash`.
- **`GET /api/audit/{id}`**: Retrieves audit record metadata by ID.
- **`GET /api/audit`**: Lists all previous audit logs.
- **`POST /api/audit/verify`**: Verifies cryptographic integrity of audit ID / proof hash.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Web3**: Wagmi v3, Viem, MetaMask Injected Connector
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React
