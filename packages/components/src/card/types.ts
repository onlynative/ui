import type { ReactNode } from 'react'
import type { ViewProps } from 'react-native'

/** Surface style variant of the card following Material Design 3 roles. */
export type CardVariant = 'elevated' | 'filled' | 'outlined'

export interface CardProps extends ViewProps {
  /** Content rendered inside the card surface. */
  children: ReactNode
  /**
   * Surface style variant.
   * @default 'elevated'
   */
  variant?: CardVariant
  /** When provided, the card becomes interactive (Pressable). Omit to render as a plain View. */
  onPress?: () => void
  /**
   * Disables the press interaction and reduces opacity. Only effective when `onPress` is provided.
   * @default false
   */
  disabled?: boolean
  /**
   * Override the container (background) color.
   * State-layer colors (hover, press) are derived automatically.
   */
  containerColor?: string
}
