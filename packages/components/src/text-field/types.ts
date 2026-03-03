import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import type { ComponentProps } from 'react'
import type { StyleProp, TextInputProps, TextStyle } from 'react-native'

/** Visual container style for the text field. */
export type TextFieldVariant = 'filled' | 'outlined'

export interface TextFieldProps
  extends Omit<TextInputProps, 'placeholderTextColor' | 'editable'> {
  /** Floating label text. Animates above the input when focused or filled. */
  label?: string
  /**
   * Container style.
   * @default 'filled'
   */
  variant?: TextFieldVariant
  /** Helper text displayed below the field. Hidden when `error` or `errorText` is active. */
  supportingText?: string
  /** Error message. When provided, implicitly sets `error` to `true` and replaces `supportingText`. */
  errorText?: string
  /**
   * When `true`, renders the field in error state with error colors.
   * @default false
   */
  error?: boolean
  /**
   * Disables text input and reduces opacity.
   * @default false
   */
  disabled?: boolean
  /** MaterialCommunityIcons icon name rendered at the start of the field. */
  leadingIcon?: ComponentProps<typeof MaterialCommunityIcons>['name']
  /** MaterialCommunityIcons icon name rendered at the end of the field. */
  trailingIcon?: ComponentProps<typeof MaterialCommunityIcons>['name']
  /** Called when the trailing icon is pressed. */
  onTrailingIconPress?: () => void
  /**
   * Override the container (background) color.
   * Disabled state still uses the standard disabled appearance.
   */
  containerColor?: string
  /**
   * Override the content (input text and icon) color.
   * Error and disabled states take precedence.
   */
  contentColor?: string
  /** Additional style applied to the text input element. */
  inputStyle?: StyleProp<TextStyle>
}
