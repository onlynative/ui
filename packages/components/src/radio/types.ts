import type { PressableProps } from 'react-native'

export interface RadioProps extends Omit<PressableProps, 'children'> {
  /**
   * Whether the radio button is selected.
   * @default false
   */
  value?: boolean
  /** Callback fired when the radio is pressed. Receives the new value. */
  onValueChange?: (value: boolean) => void
  /**
   * Override the outer ring and inner dot color when selected.
   * State-layer colors (hover, press) are derived automatically.
   */
  containerColor?: string
  /**
   * Override the outer ring color when unselected.
   */
  contentColor?: string
}
