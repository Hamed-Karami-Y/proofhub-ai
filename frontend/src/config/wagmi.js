import { defineChain } from 'viem';
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const baseSepolia = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://base-testnet.api.pocket.network'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
});
export const config = createConfig({
  chains: [baseSepolia, sepolia],
  connectors: [injected({
      target: 'metaMask',
      shimDisconnect: true,
    })],
  transports: {
    [baseSepolia.id]: http(),
    [sepolia.id]: http(),
  },
});