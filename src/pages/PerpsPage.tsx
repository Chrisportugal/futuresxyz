import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TickerBar } from '../components/perps/TickerBar'
import { MarketHeader } from '../components/perps/MarketHeader'
import { MarketSelector } from '../components/perps/MarketSelector'
import { PriceChart } from '../components/perps/PriceChart'
import { OrderBookPanel } from '../components/perps/OrderBookPanel'
import { OrderBook } from '../components/perps/OrderBook'
import { RecentTrades } from '../components/perps/RecentTrades'
import { TradePanel } from '../components/perps/TradePanel'
import { Positions } from '../components/perps/Positions'
import { useMarket } from '../contexts/MarketContext'
import { useMarketStats } from '../hooks/useMarketStats'
import { useMarketMeta } from '../hooks/useMarketMeta'
import { formatPrice } from '../lib/format'
import { TokenIcon } from '../components/TokenIcon'

type PositionsTab = 'positions' | 'orders' | 'history'
type ChartTab = 'book' | 'trades' | 'orders'

// ── SVG icons ──────────────────────────────────────────────────
function IconHome({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}
function IconPerps({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="18" rx="1" fill={active ? 'currentColor' : 'none'} />
      <rect x="14" y="8" width="7" height="13" rx="1" fill={active ? 'currentColor' : 'none'} />
    </svg>
  )
}
function IconSpot({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 16l4-8 3 6 2-3 2 5" strokeLinecap="round" strokeLinejoin="round" fill={active ? 'currentColor' : 'none'} />
      <rect x="2" y="3" width="20" height="18" rx="2" />
    </svg>
  )
}
function IconPredictions({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" fill={active ? 'rgba(114,211,200,0.15)' : 'none'} />
      <path d="M12 8v4l3 3" strokeLinecap="round" />
    </svg>
  )
}
function IconLending({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="7" width="20" height="14" rx="2" fill={active ? 'currentColor' : 'none'} />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  )
}
function IconMore() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}
function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}
function IconStar({ filled }: { filled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

// ── Home tab — market list ──────────────────────────────────────
function MobileHomeTab({ onSelectMarket }: { onSelectMarket: () => void }) {
  const { markets } = useMarketMeta()
  const { setSelectedMarket } = useMarket()

  const topMarkets = markets.slice(0, 30)

  function handleSelect(name: string) {
    setSelectedMarket(name)
    onSelectMarket()
  }

  return (
    <div className="mhl-home">
      <div className="mhl-home-header">
        <span className="mhl-home-title">Markets</span>
      </div>
      <div className="mhl-home-cols">
        <span>Name</span>
        <span>Price</span>
        <span className="mhl-home-col-right">24h</span>
      </div>
      <div className="mhl-home-list">
        {topMarkets.map(m => {
          const coin = m.name.replace('-PERP', '')
          const change = m.change24h ?? 0
          const vol = parseFloat(m.volume24h)
          const pos = change >= 0
          return (
            <button key={m.name} className="mhl-home-row" onClick={() => handleSelect(m.name)}>
              <div className="mhl-home-row-left">
                <TokenIcon symbol={coin} size={32} />
                <div className="mhl-home-row-info">
                  <span className="mhl-home-row-name">{coin}/USDC</span>
                  <span className="mhl-home-row-sub">
                    Vol {!isNaN(vol) ? '$' + (vol / 1e6).toFixed(0) + 'M' : '—'}
                  </span>
                </div>
              </div>
              <span className="mhl-home-row-price">{formatPrice(parseFloat(m.midPrice))}</span>
              <span className={`mhl-home-row-change ${pos ? 'pos' : 'neg'}`}>
                {pos ? '+' : ''}{change.toFixed(2)}%
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Trade tab — split order-form + order-book ───────────────────
function MobileTradeTab({ onOpenChart }: { onOpenChart: () => void }) {
  const { selectedMarket } = useMarket()
  const stats = useMarketStats(selectedMarket)
  const [posTab, setPosTab] = useState<PositionsTab>('positions')
  const change = stats?.change24h ?? 0
  const pos = change >= 0

  return (
    <div className="mhl-trade">
      {/* Header */}
      <div className="mhl-trade-header">
        <div className="mhl-trade-header-left">
          <MarketSelector />
        </div>
        <div className="mhl-trade-header-right">
          <span className={`mhl-trade-price ${pos ? 'stat-green' : 'stat-red'}`}>
            {stats ? formatPrice(parseFloat(stats.markPx)) : '—'}
          </span>
          <button className="mhl-icon-btn" onClick={onOpenChart} aria-label="Chart">
            <IconChart />
          </button>
        </div>
      </div>

      {/* Split body: trade form (left) + order book (right) */}
      <div className="mhl-trade-body">
        <div className="mhl-trade-form-col">
          <TradePanel />
        </div>
        <div className="mhl-trade-book-col">
          <OrderBook />
        </div>
      </div>

      {/* Positions strip */}
      <div className="mhl-pos-tabs">
        {(['positions', 'orders', 'history'] as PositionsTab[]).map(t => (
          <button
            key={t}
            className={`mhl-pos-tab${posTab === t ? ' active' : ''}`}
            onClick={() => setPosTab(t)}
          >
            {t === 'positions' ? 'Positions' : t === 'orders' ? 'Open Orders' : 'History'}
          </button>
        ))}
      </div>
      <div className="mhl-pos-content">
        <Positions />
      </div>
    </div>
  )
}

// ── Chart view ─────────────────────────────────────────────────
function MobileChartView({ onBack }: { onBack: () => void }) {
  const { selectedMarket } = useMarket()
  const stats = useMarketStats(selectedMarket)
  const [starred, setStarred] = useState(false)
  const [chartTab, setChartTab] = useState<ChartTab>('book')
  const coin = selectedMarket.replace('-PERP', '')
  const change = stats?.change24h ?? 0
  const pos = change >= 0
  const funding = stats ? parseFloat(stats.fundingRate) : null
  const vol = stats ? parseFloat(stats.volume24h) : null
  const oi = stats ? parseFloat(stats.openInterest) : null

  return (
    <div className="mhl-chart-view">
      {/* Header */}
      <div className="mhl-chart-header">
        <button className="mhl-icon-btn" onClick={onBack} aria-label="Back"><IconBack /></button>
        <span className="mhl-chart-title">{coin}/USDC</span>
        <button className={`mhl-icon-btn${starred ? ' starred' : ''}`} onClick={() => setStarred(s => !s)}>
          <IconStar filled={starred} />
        </button>
      </div>

      {/* Stats grid */}
      <div className="mhl-chart-stats">
        <div className="mhl-chart-stat">
          <span className="mhl-chart-stat-label">Last</span>
          <span className="mhl-chart-stat-val">{stats ? formatPrice(parseFloat(stats.markPx)) : '—'}</span>
        </div>
        <div className="mhl-chart-stat">
          <span className="mhl-chart-stat-label">24h Change</span>
          <span className={`mhl-chart-stat-val ${pos ? 'stat-green' : 'stat-red'}`}>
            {pos ? '+' : ''}{change.toFixed(2)}%
          </span>
        </div>
        <div className="mhl-chart-stat">
          <span className="mhl-chart-stat-label">24h Volume</span>
          <span className="mhl-chart-stat-val">{vol != null && !isNaN(vol) ? '$' + (vol / 1e6).toFixed(2) + 'M' : '—'}</span>
        </div>
        <div className="mhl-chart-stat">
          <span className="mhl-chart-stat-label">Open Interest</span>
          <span className="mhl-chart-stat-val">{oi != null && !isNaN(oi) ? '$' + (oi / 1e6).toFixed(2) + 'M' : '—'}</span>
        </div>
        <div className="mhl-chart-stat">
          <span className="mhl-chart-stat-label">Funding Rate</span>
          <span className={`mhl-chart-stat-val ${funding != null && funding >= 0 ? 'stat-green' : 'stat-red'}`}>
            {funding != null && !isNaN(funding) ? (funding * 100).toFixed(4) + '%' : '—'}
          </span>
        </div>
        <div className="mhl-chart-stat">
          <span className="mhl-chart-stat-label">Mark Price</span>
          <span className="mhl-chart-stat-val">{stats ? formatPrice(parseFloat(stats.markPx)) : '—'}</span>
        </div>
      </div>

      {/* Chart canvas */}
      <div className="mhl-chart-canvas">
        <PriceChart />
      </div>

      {/* Book / Trades tabs */}
      <div className="mhl-chart-tabs">
        {(['book', 'trades', 'orders'] as ChartTab[]).map(t => (
          <button key={t} className={`mhl-chart-tab${chartTab === t ? ' active' : ''}`} onClick={() => setChartTab(t)}>
            {t === 'book' ? 'Order Book' : t === 'trades' ? 'Trade History' : 'Orders'}
          </button>
        ))}
      </div>
      <div className="mhl-chart-book">
        {chartTab === 'book' && <OrderBook />}
        {chartTab === 'trades' && <RecentTrades />}
        {chartTab === 'orders' && <Positions />}
      </div>

      {/* Sticky buy/sell footer */}
      <div className="mhl-chart-footer">
        <button className="mhl-buy-btn">Buy / Long</button>
        <button className="mhl-sell-btn">Sell / Short</button>
      </div>
    </div>
  )
}

// ── Bottom nav ─────────────────────────────────────────────────
type NavTab = 'home' | 'perps' | 'spot' | 'predictions' | 'lending'

function MobileBottomNav({
  active,
  onPerps,
  onHome,
}: {
  active: NavTab
  onPerps: () => void
  onHome: () => void
}) {
  const navigate = useNavigate()

  return (
    <nav className="mhl-bottom-nav">
      <button className={`mhl-nav-item${active === 'home' ? ' active' : ''}`} onClick={onHome}>
        <IconHome active={active === 'home'} />
        <span>Home</span>
      </button>
      <button className={`mhl-nav-item${active === 'spot' ? ' active' : ''}`} onClick={() => navigate('/spot')}>
        <IconSpot active={active === 'spot'} />
        <span>Spot</span>
      </button>
      <button className={`mhl-nav-item${active === 'perps' ? ' active' : ''}`} onClick={onPerps}>
        <IconPerps active={active === 'perps'} />
        <span>Perps</span>
      </button>
      <button className={`mhl-nav-item${active === 'predictions' ? ' active' : ''}`} onClick={() => navigate('/predictions')}>
        <IconPredictions active={active === 'predictions'} />
        <span>Predict</span>
      </button>
      <button className={`mhl-nav-item${active === 'lending' ? ' active' : ''}`} onClick={() => navigate('/lending')}>
        <IconLending active={active === 'lending'} />
        <span>Lending</span>
      </button>
      <button className="mhl-nav-item" onClick={() => navigate('/portfolio')}>
        <IconMore />
        <span>More</span>
      </button>
    </nav>
  )
}

// ── Mobile root ────────────────────────────────────────────────
function MobilePerpsLayout() {
  const [navTab, setNavTab] = useState<NavTab>('perps')
  const [chartOpen, setChartOpen] = useState(false)

  if (chartOpen) {
    return (
      <div className="mhl-root">
        <div className="mhl-content">
          <MobileChartView onBack={() => setChartOpen(false)} />
        </div>
        <MobileBottomNav active={navTab} onPerps={() => { setChartOpen(false); setNavTab('perps') }} onHome={() => { setChartOpen(false); setNavTab('home') }} />
      </div>
    )
  }

  return (
    <div className="mhl-root">
      <div className="mhl-content">
        {navTab === 'home' && <MobileHomeTab onSelectMarket={() => setNavTab('perps')} />}
        {navTab === 'perps' && <MobileTradeTab onOpenChart={() => setChartOpen(true)} />}
      </div>
      <MobileBottomNav active={navTab} onPerps={() => setNavTab('perps')} onHome={() => setNavTab('home')} />
    </div>
  )
}

// ── Page export ────────────────────────────────────────────────
export function PerpsPage() {
  return (
    <>
      {/* Mobile layout — shown via CSS at ≤768px */}
      <div className="perps-mobile-hl">
        <MobilePerpsLayout />
      </div>

      {/* Desktop layout — hidden via CSS at ≤768px */}
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
