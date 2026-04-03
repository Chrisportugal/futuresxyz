import { useEffect } from 'react'

interface ShortcutActions {
  setSide: (side: 'buy' | 'sell') => void
  setOrderType: (type: 'market' | 'limit') => void
  onEscape?: () => void
}

export function useKeyboardShortcuts({ setSide, setOrderType, onEscape }: ShortcutActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      switch (e.key.toLowerCase()) {
        case 'b':
          setSide('buy')
          break
        case 's':
          setSide('sell')
          break
        case 'm':
          setOrderType('market')
          break
        case 'l':
          setOrderType('limit')
          break
        case 'k':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault()
            window.dispatchEvent(new CustomEvent('open-market-selector'))
          }
          break
        case 'escape':
          onEscape?.()
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setSide, setOrderType, onEscape])
}
