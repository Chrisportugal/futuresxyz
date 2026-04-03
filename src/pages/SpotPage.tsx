import { useState, useMemo } from 'react'
import { useSpotMarkets } from '../hooks/useSpotMarkets'
import { formatPrice } from '../lib/format'

type SortField = 'name' | 'price' | 'change' | 'volume'
type SortDir = 'asc' | 'desc'

function formatVol(v: number): string {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`
  if (v >= 1e6) return `$${Math.round(v / 1e6)}M`
  if (v >= 1e3) return `$${Math.round(v / 1e3)}K`
  if (v > 0) return `$${v.toFixed(0)}`
  return '$0'
}

export function SpotPage() {
  const { markets, loading } = useSpotMarkets()
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('volume')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    let list = markets.filter(m => {
      const q = search.toLowerCase()
      return m.name.toLowerCase().includes(q) ||
        m.baseToken.toLowerCase().includes(q)
    })

    list.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'name': cmp = a.baseToken.localeCompare(b.baseToken); break
        case 'price': cmp = parseFloat(a.markPx) - parseFloat(b.markPx); break
        case 'change': cmp = a.change24h - b.change24h; break
        case 'volume': cmp = parseFloat(a.volume24h) - parseFloat(b.volume24h); break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [markets, search, sortField, sortDir])

  const Arrow = ({ field }: { field: SortField }) => (
    sortField === field
      ? <span style={{ fontSize: 9, marginLeft: 4 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
      : null
  )

  return (
    <div className="spot-page">
      <div className="spot-header">
        <h2 className="spot-title">Spot Markets</h2>
        <span className="spot-count">{markets.length} pairs</span>
      </div>

      <div className="spot-search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className="spot-search"
          placeholder="Search tokens..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="spot-loading">Loading spot markets...</div>
      ) : (
        <div className="spot-table">
          <div className="spot-row spot-row-header">
            <button className="spot-col" onClick={() => handleSort('name')}>
              Token <Arrow field="name" />
            </button>
            <button className="spot-col spot-col-right" onClick={() => handleSort('price')}>
              Price <Arrow field="price" />
            </button>
            <button className="spot-col spot-col-right" onClick={() => handleSort('change')}>
              24h Change <Arrow field="change" />
            </button>
            <button className="spot-col spot-col-right" onClick={() => handleSort('volume')}>
              24h Volume <Arrow field="volume" />
            </button>
          </div>

          <div className="spot-body">
            {filtered.length === 0 ? (
              <div className="spot-empty">No markets found</div>
            ) : (
              filtered.map(m => {
                const vol = parseFloat(m.volume24h)
                return (
                  <div key={m.name} className="spot-row">
                    <span className="spot-token">
                      <span className="spot-token-name">{m.baseToken}</span>
                      <span className="spot-token-pair">/{m.quoteToken}</span>
                    </span>
                    <span className="spot-col-right spot-price">
                      ${formatPrice(m.markPx)}
                    </span>
                    <span className={`spot-col-right ${m.change24h >= 0 ? 'green' : 'red'}`}>
                      {m.change24h >= 0 ? '+' : ''}{m.change24h.toFixed(2)}%
                    </span>
                    <span className="spot-col-right spot-volume">
                      {formatVol(vol)}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
