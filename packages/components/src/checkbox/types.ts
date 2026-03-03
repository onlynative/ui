import type { PressableProps } from 'react-native'

export interface CheckboxProps extends Omit<PressableProps, 'children'> {
  /**
   * Whether the checkbox is checked.
   * @default false
   */
  value?: boolean
  /** Callback fired when the checkbox is toggled. Receives the new value. */
  onValueChange?: (value: boolean) => void
  /**
   * Override the container (box) color when checked.
   * State-layer colors (hover, press) are derived automatically.
   */
  containerColor?: string
  /**
   * Override the checkmark icon color.
   */
  contentColor?: string
}
