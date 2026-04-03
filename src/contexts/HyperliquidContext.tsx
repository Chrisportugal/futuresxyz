import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useAccount, useWalletClient, useSwitchChain } from 'wagmi'
import { HttpTransport, InfoClient, ExchangeClient } from '@nktkas/hyperliquid'
import { USE_TESTNET } from '../config/hyperliquid'
import { arbitrum } from 'wagmi/chains'

interface HyperliquidContextValue {
  info: InfoClient
  exchange: ExchangeClient | null
  isConnected: boolean
  address: string | undefined
  switchToArbitrum: () => void
}

const HyperliquidContext = createContext<HyperliquidContextValue | null>(null)

const transport = new HttpTransport({ isTestnet: USE_TESTNET })

export function HyperliquidProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, chainId } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { switchChain } = useSwitchChain()

  const info = useMemo(() => new InfoClient({ transport }), [])

  const exchange = useMemo(() => {
    if (!walletClient) return null
    try {
      return new ExchangeClient({ wallet: walletClient, transport })
    } catch (e) {
      console.error('Failed to create ExchangeClient:', e)
      return null
    }
  }, [walletClient])

  const switchToArbitrum = () => {
    if (chainId !== arbitrum.id) {
      switchChain({ chainId: arbitrum.id })
    }
  }

  return (
    <HyperliquidContext.Provider value={{ info, exchange, isConnected, address, switchToArbitrum }}>
      {children}
    </HyperliquidContext.Provider>
  )
}

export function useHyperliquid() {
  const ctx = useContext(HyperliquidContext)
  if (!ctx) throw new Error('useHyperliquid must be used within HyperliquidProvider')
  return ctx
}
