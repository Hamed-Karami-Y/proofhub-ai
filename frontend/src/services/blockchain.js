import { createPublicClient, http } from 'viem';
import { sepolia, mainnet, hardhat, polygon, arbitrum} from 'viem/chains';
import { PROOF_REGISTRY_ADDRESS, PROOF_REGISTRY_ABI, PROOF_REGISTRY_CHAIN_ID } from '../config/contract.js';

// Select chain object based on configured chain ID
const chainMap = {
  11155111: sepolia,
  1: mainnet,
  31337: hardhat,
  137: polygon,
  42161: arbitrum,
};

export const activeChain = chainMap[PROOF_REGISTRY_CHAIN_ID] || sepolia;

// Create public client for read calls
export const publicClient = createPublicClient({
  chain: activeChain,
  transport: http(),
});

/**
 * Read and verify a proof directly from the smart contract on-chain
 * @param {string} proofHash - 32-byte hex proof hash (0x prefixed)
 * @returns {Promise<{ exists: boolean, submitter: string, timestamp: number }>}
 */
export async function verifyProofOnChain(proofHash) {
  try {
    if (!proofHash || !proofHash.startsWith('0x')) {
      throw new Error('Invalid proof hash format. Must be a 0x-prefixed 32-byte hex string.');
    }

    // Ensure hash is 32-byte formatted (66 characters total)
    let formattedHash = proofHash;
    if (proofHash.length < 66) {
      formattedHash = '0x' + proofHash.slice(2).padStart(64, '0');
    }

    const data = await publicClient.readContract({
      address: PROOF_REGISTRY_ADDRESS,
      abi: PROOF_REGISTRY_ABI,
      functionName: 'verifyProof',
      args: [formattedHash],
    });

    // data format: [exists: boolean, submitter: string, timestamp: bigint]
    const exists = Boolean(data[0] || data.exists);
    const submitter = String(data[1] || data.submitter || '');
    const timestampBigInt = data[2] || data.timestamp || 0n;
    const timestamp = Number(timestampBigInt);

    return {
      exists,
      submitter,
      timestamp,
      rawProofHash: formattedHash,
    };
  } catch (error) {
    console.error('On-chain verification error:', error);
    // If contract is uninitialized or dummy address is configured in env, return clean failure state
    return {
      exists: false,
      submitter: '0x0000000000000000000000000000000000000000',
      timestamp: 0,
      error: error.message || 'On-chain query failed',
    };
  }
}

/**
 * Format bytes32 parameter helper
 * @param {string} hash
 */
export function formatBytes32Hash(hash) {
  if (!hash) return '0x0000000000000000000000000000000000000000000000000000000000000000';
  let clean = hash.trim();
  if (!clean.startsWith('0x')) {
    clean = '0x' + clean;
  }
  if (clean.length < 66) {
    clean = '0x' + clean.slice(2).padStart(64, '0');
  }
  return clean.slice(0, 66);
}
