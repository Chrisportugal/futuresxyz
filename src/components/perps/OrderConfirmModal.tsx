import { formatUsd } from '../../lib/format'

interface OrderConfirmModalProps {
  market: string
  side: 'buy' | 'sell'
  size: string
  price: number
  leverage: number
  orderType: 'market' | 'limit'
  onConfirm: () => void
  onCancel: () => void
}

export function OrderConfirmModal({
  market, side, size, price, leverage, orderType, onConfirm, onCancel,
}: OrderConfirmModalProps) {
  const sizeNum = parseFloat(size) || 0
  const orderValue = sizeNum * price
  const margin = leverage > 0 ? orderValue / leverage : 0
  const fee = orderValue * 0.00035
  const liqPrice = side === 'buy'
    ? price * (1 - 0.9 / leverage)
    : price * (1 + 0.9 / leverage)

  return (
    <div className="ocm-overlay" onClick={onCancel}>
      <div className="ocm-card" onClick={e => e.stopPropagation()}>
        <div className="ocm-title">Confirm Order</div>

        <div className="ocm-rows">
          <div className="ocm-row">
            <span>Market</span>
            <span>{market}-PERP</span>
          </div>
          <div className="ocm-row">
            <span>Side</span>
            <span className={side === 'buy' ? 'green' : 'red'}>
              {side === 'buy' ? 'Long' : 'Short'}
            </span>
          </div>
          <div className="ocm-row">
            <span>Type</span>
            <span>{orderType === 'market' ? 'Market' : 'Limit'}</span>
          </div>
          <div className="ocm-row">
            <span>Size</span>
            <span>{size} {market}</span>
          </div>
          <div className="ocm-row">
            <span>Price</span>
            <span>{orderType === 'market' ? 'Market' : `$${price.toLocaleString()}`}</span>
          </div>
          <div className="ocm-row">
            <span>Leverage</span>
            <span>{leverage}x</span>
          </div>
          <div className="ocm-divider" />
          <div className="ocm-row">
            <span>Order Value</span>
            <span>{formatUsd(orderValue)}</span>
          </div>
          <div className="ocm-row">
            <span>Margin Required</span>
            <span>{formatUsd(margin)}</span>
          </div>
          <div className="ocm-row">
            <span>Est. Fee</span>
            <span>{formatUsd(fee)}</span>
          </div>
          <div className="ocm-row">
            <span>Est. Liq. Price</span>
            <span>${liqPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="ocm-buttons">
          <button className="ocm-btn ocm-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className={`ocm-btn ocm-btn-confirm ${side}`} onClick={onConfirm}>
            Confirm {side === 'buy' ? 'Long' : 'Short'}
          </button>
        </div>
      </div>
    </div>
  )
}
