import { http, createConfig } from 'wagmi'
import { mainnet, arbitrum } from 'wagmi/chains'
import { defineChain } from 'viem'
import { injected } from 'wagmi/connectors'

export const hyperEVM = defineChain({
  id: 999,
  name: 'HyperEVM',
  nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: { name: 'HyperScan', url: 'https://hyperscan.xyz' },
  },
})

// Hyperliquid L1 signing chain — required for order signing
export const hyperliquidL1 = defineChain({
  id: 1337,
  name: 'Hyperliquid L1',
  nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.hyperliquid.xyz/evm'] },
  },
})

export const config = createConfig({
  chains: [arbitrum, mainnet, hyperEVM, hyperliquidL1],
  connectors: [
    injected(),
  ],
  transports: {
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
    [hyperEVM.id]: http(),
    [hyperliquidL1.id]: http('https://api.hyperliquid.xyz/evm'),
  },
})
