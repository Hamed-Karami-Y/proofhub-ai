import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { PROOF_REGISTRY_ADDRESS, PROOF_REGISTRY_ABI, PROOF_REGISTRY_CHAIN_ID } from '../config/contract.js';
import { formatBytes32Hash } from '../services/blockchain.js';
import { useState } from 'react';

export function useWallet() {
  const { address, isConnected, isConnecting, chain } = useAccount();
  const { connectors, connect, isPending: isConnectingWallet, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [walletError, setWalletError] = useState(null);

  const {
    data: txHash,
    writeContract,
    isPending: isSubmittingTx,
    error: writeError,
    reset: resetTx,
  } = useWriteContract();

  const { isLoading: isConfirmingTx, isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Handle wallet connection
  const connectMetaMask = async () => {
    setWalletError(null);
    try {
      if (typeof window !== 'undefined' && !window.ethereum) {
        throw new Error('MetaMask or Web3 wallet is not installed. Please install MetaMask browser extension.');
      }

      const injectedConnector = connectors.find((c) => c.id === 'injected' || c.name.toLowerCase().includes('metamask')) || connectors[0];
      
      if (!injectedConnector) {
        throw new Error('No compatible Web3 wallet connector found.');
      }

      await connect({ connector: injectedConnector });
    } catch (err) {
      console.error('Wallet connection error:', err);
      let message = err.message || 'Failed to connect wallet.';
      if (err.name === 'UserRejectedRequestError' || message.includes('rejected')) {
        message = 'Connection request was rejected by the user.';
      }
      setWalletError(message);
    }
  };

  // Switch to target configured blockchain network
  const handleSwitchNetwork = async () => {
    if (switchChain) {
      try {
        await switchChain({ chainId: PROOF_REGISTRY_CHAIN_ID });
      } catch (err) {
        console.error('Switch chain error:', err);
        setWalletError(`Failed to switch network to chain ID ${PROOF_REGISTRY_CHAIN_ID}.`);
      }
    }
  };

  // Register proof on smart contract
 const registerProof = async (proofHash) => {
  setWalletError(null);
  resetTx();

  if (!isConnected) {
    throw new Error('Please connect your Web3 wallet first.');
  }

  // Ensure wallet is on the correct network
  if (!chain || chain.id !== PROOF_REGISTRY_CHAIN_ID) {
    try {
      await switchChain({
        chainId: PROOF_REGISTRY_CHAIN_ID,
      });
    } catch (err) {
      console.error('Network switch error:', err);

      const message =
        err?.message?.toLowerCase().includes('reject')
          ? 'Network switch was rejected in wallet.'
          : `Please switch your wallet to the required network (Chain ID: ${PROOF_REGISTRY_CHAIN_ID}).`;

      setWalletError(message);
      throw new Error(message);
    }
  }

  const formattedHash = formatBytes32Hash(proofHash);

  try {
    writeContract({
      address: PROOF_REGISTRY_ADDRESS,
      abi: PROOF_REGISTRY_ABI,
      functionName: 'registerProof',
      args: [formattedHash],
    });
  } catch (err) {
    console.error('Write contract error:', err);

    let msg = err.message || 'Failed to send transaction.';

    if (
      msg.includes('user rejected') ||
      msg.includes('User rejected')
    ) {
      msg = 'Transaction was rejected in wallet.';
    }

    setWalletError(msg);
    throw new Error(msg);
  }
};

  const isWrongNetwork = isConnected && chain && chain.id !== PROOF_REGISTRY_CHAIN_ID;

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isConnectingWallet,
    chain,
    isWrongNetwork,
    targetChainId: PROOF_REGISTRY_CHAIN_ID,
    connectMetaMask,
    disconnect,
    switchNetwork: handleSwitchNetwork,
    registerProof,
    txHash,
    isSubmittingTx,
    isConfirmingTx,
    isTxConfirmed,
    walletError: walletError || (connectError ? connectError.message : null) || (writeError ? writeError.message : null),
    clearWalletError: () => setWalletError(null),
  };
}
