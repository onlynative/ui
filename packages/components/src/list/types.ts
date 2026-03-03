import type { ReactNode } from 'react'
import type { StyleProp, ViewProps, ViewStyle } from 'react-native'

export interface ListProps extends ViewProps {
  /** Content rendered inside the list container. */
  children: ReactNode
  style?: StyleProp<ViewStyle>
}

/** Number of text lines the item displays, used to determine minimum height. */
export type ListItemLines = 1 | 2 | 3

export interface ListItemProps extends ViewProps {
  /** Primary text displayed on the list item. */
  headlineText: string
  /** Secondary text displayed below the headline. */
  supportingText?: string
  /** Text displayed above the headline (e.g. category label). */
  overlineText?: string
  /** Short text displayed at the trailing edge (e.g. "100+", timestamp). */
  trailingSupportingText?: string
  /** Content rendered before the text block (icon, avatar, image, checkbox). */
  leadingContent?: ReactNode
  /** Content rendered after the text block (icon, switch, checkbox). */
  trailingContent?: ReactNode
  /** When provided, the item becomes interactive (Pressable). Omit to render as a plain View. */
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
  /**
   * Maximum number of lines for supportingText before truncating.
   * @default 1
   */
  supportingTextNumberOfLines?: number
  style?: StyleProp<ViewStyle>
}

export interface ListDividerProps extends ViewProps {
  /**
   * When true, adds a leading inset so the divider aligns with text
   * that follows a leading icon (56dp from the start edge).
   * @default false
   */
  inset?: boolean
  style?: StyleProp<ViewStyle>
}
