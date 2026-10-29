/**
 * ProofRegistry Smart Contract Configuration
 */

export const PROOF_REGISTRY_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS || "0x30FE9fA742A36b240c488EA7FD391ee347C25cbC";

export const PROOF_REGISTRY_CHAIN_ID = parseInt(
  import.meta.env.VITE_CHAIN_ID || "11155111",
  10
);

export const PROOF_REGISTRY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "proofHash",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "address",
        name: "submitter",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "ProofRegistered",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "proofHash",
        "type": "bytes32"
      }
    ],
    name: "registerProof",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "proofHash",
        type: "bytes32"
      }
    ],
    name: "verifyProof",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool"
      },
      {
        internalType: "address",
        name: "submitter",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
