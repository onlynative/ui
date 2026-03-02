import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import type { ComponentProps } from 'react'
import type { PressableProps, StyleProp, TextStyle } from 'react-native'

/** Visual style variant of the button following Material Design 3 roles. */
export type ButtonVariant =
  | 'filled'
  | 'elevated'
  | 'outlined'
  | 'text'
  | 'tonal'

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Text label rendered inside the button. */
  children: string
  /**
   * Visual variant. Controls background, border, and text color.
   * @default 'filled'
   */
  variant?: ButtonVariant
  /** Name of a MaterialCommunityIcons icon to show before the label. */
  leadingIcon?: ComponentProps<typeof MaterialCommunityIcons>['name']
  /** Name of a MaterialCommunityIcons icon to show after the label. */
  trailingIcon?: ComponentProps<typeof MaterialCommunityIcons>['name']
  /**
   * Size of leading and trailing icons in dp.
   * @default 18
   */
  iconSize?: number
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
