import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface PortalEntry {
  id: string
  node: ReactNode
}

export interface PortalHostProps {
  children: ReactNode
  /** Style applied to the root container that wraps host children and the overlay layer. */
  style?: StyleProp<ViewStyle>
}

export interface PortalProps {
  children: ReactNode
}
