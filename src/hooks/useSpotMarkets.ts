import { useState, useEffect, useRef, useCallback } from 'react'
import { useHyperliquid } from '../contexts/HyperliquidContext'

export interface SpotMarket {
  name: string
  index: number
  baseToken: string
  quoteToken: string
  markPx: string
  volume24h: string
  change24h: number
  prevDayPx: string
}

let cachedSpot: SpotMarket[] = []
let lastFetch = 0

export function useSpotMarkets() {
  const { info } = useHyperliquid()
  const [markets, setMarkets] = useState<SpotMarket[]>(cachedSpot)
  const [loading, setLoading] = useState(cachedSpot.length === 0)
  const infoRef = useRef(info)
  infoRef.current = info

  const fetch = useCallback(async () => {
    const now = Date.now()
    if (now - lastFetch < 15000 && cachedSpot.length > 0) {
      setMarkets(cachedSpot)
      setLoading(false)
      return
    }

    try {
      const data = await infoRef.current.spotMetaAndAssetCtxs()
      const meta = (data as unknown[])[0] as {
        universe: Array<{ name: string; tokens: number[]; index: number }>
        tokens: Array<{ name: string; index: number }>
      }
      const ctxs = (data as unknown[])[1] as Array<{
        markPx: string
        dayNtlVlm: string
        prevDayPx: string
      }>

      const tokenNames = meta.tokens.reduce((acc, t) => {
        acc[t.index] = t.name
        return acc
      }, {} as Record<number, string>)

      const spotList: SpotMarket[] = meta.universe.map((pair, i) => {
        const ctx = ctxs[i]
        const markPx = ctx?.markPx ?? '0'
        const prevDay = parseFloat(ctx?.prevDayPx ?? '0')
        const current = parseFloat(markPx)
        const change = prevDay > 0 ? ((current - prevDay) / prevDay) * 100 : 0

        return {
          name: pair.name,
          index: pair.index ?? i,
          baseToken: tokenNames[pair.tokens[0]] ?? `@${pair.tokens[0]}`,
          quoteToken: tokenNames[pair.tokens[1]] ?? 'USDC',
          markPx,
          volume24h: ctx?.dayNtlVlm ?? '0',
          change24h: change,
          prevDayPx: ctx?.prevDayPx ?? '0',
        }
      })

      cachedSpot = spotList
      lastFetch = now
      setMarkets(spotList)
    } catch (e) {
      console.error('Failed to fetch spot markets:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    const interval = setInterval(fetch, 30000)
    return () => clearInterval(interval)
  }, [fetch])

  return { markets, loading }
}
