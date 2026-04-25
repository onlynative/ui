import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { PortalContext } from './context'
import { styles } from './styles'
import type { PortalEntry, PortalHostProps } from './types'

export function PortalHost({ children, style }: PortalHostProps) {
  const [entries, setEntries] = useState<PortalEntry[]>([])

  const set = useCallback((id: string, node: ReactNode) => {
    setEntries((prev) => {
      const idx = prev.findIndex((entry) => entry.id === id)
      if (idx === -1) return [...prev, { id, node }]
      const next = prev.slice()
      next[idx] = { id, node }
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }, [])

  const value = useMemo(() => ({ set, remove }), [set, remove])

  return (
    <PortalContext.Provider value={value}>
      <View style={[styles.root, style]} collapsable={false}>
        {children}
        {entries.length > 0 && (
          <View
            style={styles.overlay}
            pointerEvents="box-none"
            collapsable={false}
          >
            {entries.map((entry) => (
              <View
                key={entry.id}
                style={styles.overlay}
                pointerEvents="box-none"
                collapsable={false}
              >
                {entry.node}
              </View>
            ))}
          </View>
        )}
      </View>
    </PortalContext.Provider>
  )
}
