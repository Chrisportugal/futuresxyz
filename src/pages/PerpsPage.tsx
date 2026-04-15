import { useState } from 'react'
import { TickerBar } from '../components/perps/TickerBar'
import { MarketHeader } from '../components/perps/MarketHeader'
import { MarketSelector } from '../components/perps/MarketSelector'
import { PriceChart } from '../components/perps/PriceChart'
import { OrderBookPanel } from '../components/perps/OrderBookPanel'
import { OrderBook } from '../components/perps/OrderBook'
import { RecentTrades } from '../components/perps/RecentTrades'
import { TradePanel } from '../components/perps/TradePanel'
import { Positions } from '../components/perps/Positions'
import { ConnectButton } from '../components/shared/ConnectButton'
import { useMarket } from '../contexts/MarketContext'
import { useMarketStats } from '../hooks/useMarketStats'
import { formatPrice } from '../lib/format'

type MobileSurfaceTab = 'chart' | 'book' | 'trades'
type MobileSheet = 'none' | 'trade' | 'account'

export function PerpsPage() {
  const [mobileSurfaceTab, setMobileSurfaceTab] = useState<MobileSurfaceTab>('chart')
  const [mobileSheet, setMobileSheet] = useState<MobileSheet>('none')
  const { selectedMarket } = useMarket()
  const stats = useMarketStats(selectedMarket)
  const change = stats?.change24h ?? 0

  return (
    <>
      {/* ── Mobile layout (CSS-only, no JS detection) ── */}
      <div className="perps-mobile-hl">
        <div className="perps-mobile-topbar">
          <div className="perps-mobile-brand">
            <button className="perps-mobile-icon-btn" aria-label="Menu">
              <span /><span /><span />
            </button>
            <div className="perps-mobile-wordmark">
              <span className="perps-mobile-logo-dot" />
              <span className="perps-mobile-logo-dot" />
            </div>
          </div>
          <div className="perps-mobile-actions">
            <ConnectButton />
            <button className="perps-mobile-icon-btn" aria-label="Settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            </button>
          </div>
        </div>

        <div className="perps-mobile-marketbar">
          <div className="perps-mobile-marketbar-left">
            <MarketSelector />
            <span className="perps-mobile-market-type">Perps</span>
          </div>
          <div className="perps-mobile-marketbar-right">
            <span className="perps-mobile-market-price">{stats ? formatPrice(stats.markPx) : '—'}</span>
            <span className={`perps-mobile-market-change ${change >= 0 ? 'stat-green' : 'stat-red'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="perps-mobile-surface-tabs" role="tablist">
          {(['chart', 'book', 'trades'] as MobileSurfaceTab[]).map(t => (
            <button
              key={t}
              className={`perps-mobile-surface-tab${mobileSurfaceTab === t ? ' active' : ''}`}
              onClick={() => setMobileSurfaceTab(t)}
            >
              {t === 'chart' ? 'Chart' : t === 'book' ? 'Order Book' : 'Trades'}
            </button>
          ))}
        </div>

        <div className="perps-mobile-surface">
          {mobileSurfaceTab === 'chart' && (
            <div className="perps-mobile-chart-shell"><PriceChart /></div>
          )}
          {mobileSurfaceTab === 'book' && (
            <div className="perps-mobile-book-shell"><OrderBook /></div>
          )}
          {mobileSurfaceTab === 'trades' && (
            <div className="perps-mobile-trades-shell"><RecentTrades /></div>
          )}
        </div>

        <div className="perps-mobile-bottomnav">
          <button className="perps-mobile-bottomitem" onClick={() => window.dispatchEvent(new Event('open-market-selector'))}>
            <span className="perps-mobile-bottomicon bars" />
            <span>Markets</span>
          </button>
          <button
            className={`perps-mobile-bottomitem${mobileSheet === 'trade' ? ' active' : ''}`}
            onClick={() => setMobileSheet(mobileSheet === 'trade' ? 'none' : 'trade')}
          >
            <span className="perps-mobile-bottomicon trade" />
            <span>Trade</span>
          </button>
          <button
            className={`perps-mobile-bottomitem${mobileSheet === 'account' ? ' active' : ''}`}
            onClick={() => setMobileSheet(mobileSheet === 'account' ? 'none' : 'account')}
          >
            <span className="perps-mobile-bottomicon account" />
            <span>Account</span>
          </button>
        </div>

        {mobileSheet !== 'none' && (
          <div className="perps-mobile-sheet-backdrop" onClick={() => setMobileSheet('none')}>
            <div className="perps-mobile-sheet" onClick={e => e.stopPropagation()}>
              <button className="perps-mobile-sheet-handle" onClick={() => setMobileSheet('none')} aria-label="Close" />
              <div className="perps-mobile-sheet-content">
                {mobileSheet === 'trade' ? <TradePanel /> : <Positions />}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Desktop layout (CSS-only, no JS detection) ── */}
      <div className="perps-page perps-desktop-only">
        <TickerBar />
        <MarketHeader />
        <div className="perps-main">
          <div className="perps-left">
            <div className="perps-top-row">
              <div className="perps-chart-area"><PriceChart /></div>
              <div className="perps-book-area"><OrderBookPanel /></div>
            </div>
            <div className="perps-bottom"><Positions /></div>
          </div>
          <div className="perps-trade-area"><TradePanel /></div>
        </div>
      </div>
    </>
  )
}
