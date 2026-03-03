import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import type { ComponentProps } from 'react'
import type { PressableProps } from 'react-native'

export interface SwitchProps extends Omit<PressableProps, 'children'> {
  /**
   * Whether the switch is toggled on.
   * @default false
   */
  value?: boolean
  /** Callback fired when the switch is toggled. Receives the new value. */
  onValueChange?: (value: boolean) => void
  /**
   * Name of a MaterialCommunityIcons icon to show on the thumb when selected.
   * @default 'check'
   */
  selectedIcon?: ComponentProps<typeof MaterialCommunityIcons>['name']
  /**
   * Name of a MaterialCommunityIcons icon to show on the thumb when unselected.
   * When provided, the thumb renders at the larger selected size.
   */
  unselectedIcon?: ComponentProps<typeof MaterialCommunityIcons>['name']
  /**
   * Override the track color.
   * State-layer colors (hover, press) are derived automatically.
   */
  containerColor?: string
  /**
   * Override the thumb and icon color.
   */
  contentColor?: string
}
