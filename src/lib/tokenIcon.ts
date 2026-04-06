// Map token symbols to CoinGecko IDs for logo URLs
const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  HYPE: 'hyperliquid',
  XRP: 'ripple',
  BNB: 'binancecoin',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  AVAX: 'avalanche-2',
  DOT: 'polkadot',
  LINK: 'chainlink',
  MATIC: 'matic-network',
  POL: 'matic-network',
  UNI: 'uniswap',
  AAVE: 'aave',
  ATOM: 'cosmos',
  NEAR: 'near',
  ARB: 'arbitrum',
  OP: 'optimism',
  SUI: 'sui',
  APT: 'aptos',
  SEI: 'sei-network',
  TIA: 'celestia',
  INJ: 'injective-protocol',
  FET: 'fetch-ai',
  RENDER: 'render-token',
  PEPE: 'pepe',
  SHIB: 'shiba-inu',
  BONK: 'bonk',
  WIF: 'dogwifcoin',
  FTM: 'fantom',
  LDO: 'lido-dao',
  MKR: 'maker',
  CRV: 'curve-dao-token',
  SNX: 'havven',
  COMP: 'compound-governance-token',
  GMX: 'gmx',
  DYDX: 'dydx-chain',
  STX: 'blockstack',
  ICP: 'internet-computer',
  ALGO: 'algorand',
  XLM: 'stellar',
  TRX: 'tron',
  TON: 'the-open-network',
  JUP: 'jupiter-exchange-solana',
  ENA: 'ethena',
  PENDLE: 'pendle',
  PAXG: 'pax-gold',
  ZK: 'zksync',
  ZETA: 'zetachain',
  BERA: 'berachain-bera',
  MOVE: 'movement',
  S: 'sonic-svm',
  IO: 'io-net',
  TAO: 'bittensor',
  FLOKI: 'floki',
  TRUMP: 'official-trump',
  POPCAT: 'popcat',
  BRETT: 'based-brett',
  PURR: 'purr-2',
  KAITO: 'kaito',
  ONDO: 'ondo-finance',
  INIT: 'initia',
  GRASS: 'grass',
  EIGEN: 'eigenlayer',
  MORPHO: 'morpho',
  ETHFI: 'ether-fi',
  STG: 'stargate-finance',
  SUSHI: 'sushi',
  ZEC: 'zcash',
  SPX: 'spx6900',
}

export function getTokenIconUrl(symbol: string): string {
  const clean = symbol.replace(/^k/, '').toUpperCase()
  const id = COINGECKO_IDS[clean]
  if (id) {
    return `https://assets.coingecko.com/coins/images/${getCoinGeckoImageId(id)}/small/${id}.png`
  }
  // Fallback: use CryptoCompare
  return `https://www.cryptocompare.com/media/37746251/${clean.toLowerCase()}.png`
}

// CoinGecko numeric IDs for image paths
function getCoinGeckoImageId(id: string): number {
  const ids: Record<string, number> = {
    bitcoin: 1,
    ethereum: 279,
    solana: 4128,
    ripple: 44,
    binancecoin: 825,
    dogecoin: 5,
    cardano: 975,
    polkadot: 12171,
    chainlink: 877,
    uniswap: 12504,
    'avalanche-2': 12559,
  }
  return ids[id] || 1
}

// Simpler approach: use CryptoFonts / simple letter-based fallback
export function getTokenIconCdn(symbol: string): string {
  const clean = symbol.replace(/^k/, '').toLowerCase()
  return `https://raw.githubusercontent.com/nickreese/cryptocurrency-icons/master/32/color/${clean}.png`
}
