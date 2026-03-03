import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import type { ComponentProps, ReactNode } from 'react'
import type { PressableProps, StyleProp, TextStyle } from 'react-native'

/** Visual variant of the chip following Material Design 3 chip types. */
export type ChipVariant = 'assist' | 'filter' | 'input' | 'suggestion'

export interface ChipProps extends Omit<PressableProps, 'children'> {
  /** Text label rendered inside the chip. */
  children: string
  /**
   * Chip type variant. Controls appearance, allowed interactions, and icon behavior.
   * @default 'assist'
   */
  variant?: ChipVariant
  /**
   * Whether the chip uses an elevated surface instead of an outline border.
   * Available on `assist`, `filter`, and `suggestion` variants.
   * Ignored on `input` variant (always outlined).
   * @default false
   */
  elevated?: boolean
  /**
   * Whether the chip is in a selected (toggled-on) state.
   * Only meaningful for the `filter` variant. Ignored by other variants.
   */
  selected?: boolean
  /** Name of a MaterialCommunityIcons icon to show before the label. */
  leadingIcon?: ComponentProps<typeof MaterialCommunityIcons>['name']
  /**
   * Size of the leading icon in dp.
   * @default 18
   */
  iconSize?: number
  /**
   * Custom avatar content (e.g. a small Image or View) to render before the label.
   * Only applicable to the `input` variant. Takes precedence over `leadingIcon`.
   */
  avatar?: ReactNode
  /**
   * Callback fired when the close/remove icon is pressed.
   * When provided, renders a trailing close icon.
   * Only renders on `input` and `filter` (when selected) variants.
   */
  onClose?: () => void
  /**
   * Override the container (background) color.
   * State-layer colors (hover, press) are derived automatically.
   */
  containerColor?: string
  /**
   * Override the content (label and icon) color.
   * State-layer colors are derived automatically when no containerColor is set.
   */
  contentColor?: string
  /** Additional style applied to the label text. */
  labelStyle?: StyleProp<TextStyle>
}
