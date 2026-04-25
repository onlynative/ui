import { createContext } from 'react'
import type { ReactNode } from 'react'

export interface PortalContextValue {
  set: (id: string, node: ReactNode) => void
  remove: (id: string) => void
}

export const PortalContext = createContext<PortalContextValue | null>(null)
