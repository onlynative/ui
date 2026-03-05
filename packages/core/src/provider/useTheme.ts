import { useContext } from 'react'

import type { BaseTheme, Theme } from '../theme/types'
import { ThemeContext } from './ThemeContext'

/**
 * Returns the current theme from the nearest `ThemeProvider`.
 *
 * Without a type parameter, returns the Material Design 3 `Theme`.
 * Pass a custom theme type to get typed access to your design system's tokens.
 *
 * @example
 * // Material Design 3 (default)
 * const theme = useTheme()
 * theme.colors.primary // ✓ typed
 *
 * // Custom design system
 * const theme = useTheme<MyTheme>()
 * theme.colors.brand // ✓ typed
 */
export function useTheme<T extends BaseTheme = Theme>(): T {
  return useContext(ThemeContext) as T
}
