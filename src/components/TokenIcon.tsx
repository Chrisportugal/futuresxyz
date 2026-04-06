import { useState } from 'react'

// Use CoinGecko CDN via jsdelivr mirror for reliability
const ICON_MAP: Record<string, string> = {
  BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  HYPE: 'https://assets.coingecko.com/coins/images/40430/small/hyperliquid.png',
  XRP: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  BNB: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  DOGE: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  ADA: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
  DOT: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
  LINK: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
  MATIC: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png',
  POL: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png',
  UNI: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg',
  AAVE: 'https://assets.coingecko.com/coins/images/12645/small/aave-token-round.png',
  ATOM: 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
  NEAR: 'https://assets.coingecko.com/coins/images/10365/small/near.jpg',
  ARB: 'https://assets.coingecko.com/coins/images/16547/small/arb.jpg',
  OP: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
  SUI: 'https://assets.coingecko.com/coins/images/26375/small/sui-ocean-square.png',
  APT: 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png',
  SEI: 'https://assets.coingecko.com/coins/images/28205/small/Sei_Logo_-_Transparent.png',
  TIA: 'https://assets.coingecko.com/coins/images/31967/small/tia.jpg',
  INJ: 'https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png',
  FET: 'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg',
  RENDER: 'https://assets.coingecko.com/coins/images/11636/small/rndr.png',
  PEPE: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
  SHIB: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
  BONK: 'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg',
  WIF: 'https://assets.coingecko.com/coins/images/33566/small/dogwifhat.jpg',
  FTM: 'https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png',
  LDO: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png',
  MKR: 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png',
  CRV: 'https://assets.coingecko.com/coins/images/12124/small/Curve.png',
  COMP: 'https://assets.coingecko.com/coins/images/10775/small/COMP.png',
  GMX: 'https://assets.coingecko.com/coins/images/18323/small/arbit.png',
  DYDX: 'https://assets.coingecko.com/coins/images/17500/small/hjnIm9bV.jpg',
  STX: 'https://assets.coingecko.com/coins/images/2069/small/Stacks_logo_full.png',
  ICP: 'https://assets.coingecko.com/coins/images/14495/small/Internet_Computer_logo.png',
  ALGO: 'https://assets.coingecko.com/coins/images/4380/small/download.png',
  XLM: 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png',
  TRX: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
  TON: 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png',
  JUP: 'https://assets.coingecko.com/coins/images/34188/small/jup.png',
  PENDLE: 'https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png',
  PAXG: 'https://assets.coingecko.com/coins/images/9519/small/paxg.PNG',
  FLOKI: 'https://assets.coingecko.com/coins/images/16746/small/PNG_image.png',
  TRUMP: 'https://assets.coingecko.com/coins/images/53746/small/trump.jpg',
  ZEC: 'https://assets.coingecko.com/coins/images/486/small/circle-zcash-color.png',
  ONDO: 'https://assets.coingecko.com/coins/images/26580/small/ONDO.png',
  ENA: 'https://assets.coingecko.com/coins/images/36530/small/ethena.png',
  EIGEN: 'https://assets.coingecko.com/coins/images/37126/small/eigenlayer.jpeg',
  TAO: 'https://assets.coingecko.com/coins/images/28452/small/ARUsPeNQ_400x400.jpeg',
  GRASS: 'https://assets.coingecko.com/coins/images/40077/small/grass.jpg',
  POPCAT: 'https://assets.coingecko.com/coins/images/35636/small/popcat.jpg',
  PURR: 'https://assets.coingecko.com/coins/images/38023/small/purr.jpg',
  SPX: 'https://assets.coingecko.com/coins/images/31401/small/sticker_%281%29.jpg',
  USDC: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
}

export function TokenIcon({ symbol, size = 18 }: { symbol: string; size?: number }) {
  const [error, setError] = useState(false)
  const clean = symbol.replace(/^k/, '').toUpperCase()
  const url = ICON_MAP[clean]

  if (!url || error) {
    // Fallback: colored circle with letter
    const colors: Record<string, string> = {
      B: '#f7931a', E: '#627eea', S: '#9945ff', H: '#00d4aa',
      X: '#00aae4', D: '#c2a633', A: '#0033ad', L: '#2a5ada',
    }
    const color = colors[clean[0]] || '#6366f1'
    return (
      <span
        className="token-icon-fallback"
        style={{
          width: size, height: size, borderRadius: '50%', background: color,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.55, fontWeight: 700, color: '#fff', flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {clean[0]}
      </span>
    )
  }

  return (
    <img
      src={url}
      alt={clean}
      width={size}
      height={size}
      className="token-icon"
      style={{ borderRadius: '50%', flexShrink: 0 }}
      onError={() => setError(true)}
    />
  )
}
