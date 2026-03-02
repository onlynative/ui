import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import type { ComponentProps } from 'react'
import type { PressableProps } from 'react-native'

/** Visual fill style of the icon button. */
export type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard'

/** Touch target size of the icon button. */
export type IconButtonSize = 'small' | 'medium' | 'large'

export interface IconButtonProps
  extends Omit<
    PressableProps,
    'children' | 'onPress' | 'style' | 'accessibilityLabel'
  > {
  /** MaterialCommunityIcons icon name to display. */
  icon: ComponentProps<typeof MaterialCommunityIcons>['name']
  /** Icon to display when `selected` is `true` (toggle mode). */
  selectedIcon?: ComponentProps<typeof MaterialCommunityIcons>['name']
  /** Overrides the automatic icon color derived from the variant and state. */
  iconColor?: string
  /**
   * Override the content (icon) color.
   * Takes precedence over `iconColor` when both are provided.
   */
  contentColor?: string
  /**
   * Override the container (background) color.
   * State-layer colors (hover, press) are derived automatically.
   */
  containerColor?: string
  /** Custom style applied to the root container. */
  style?: PressableProps['style']
  /** Called when the button is pressed. */
  onPress?: () => void
  /**
   * Disables the button.
   * @default false
   */
  disabled?: boolean
  /**
   * Visual style variant.
   * @default 'filled'
   */
  variant?: IconButtonVariant
  /** Enables toggle mode. The button changes appearance based on selected/unselected state. */
  selected?: boolean
  /**
   * Physical size of the touch target and icon container.
   * @default 'medium'
   */
  size?: IconButtonSize
  /** Required — icon-only buttons must have a label for screen readers. */
  accessibilityLabel: string
}
