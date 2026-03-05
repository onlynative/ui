import * as React from 'react'

import type { BaseTheme } from '../theme/types'
import { lightTheme } from '../theme/light'
import { ThemeContext } from './ThemeContext'

export interface ThemeProviderProps {
  /**
   * Theme object to provide to all child components via context.
   * Accepts any theme extending `BaseTheme` — Material, Apple, or custom.
   * @default lightTheme (Material Design 3)
   */
  theme?: BaseTheme
  /** Tree of components that will have access to the theme via `useTheme()`. */
  children: React.ReactNode
}

/**
 * Provides a theme to all child components via context.
 * Works with any design system — Material Design 3, Apple HIG, or custom themes.
 * Defaults to the Material Design 3 light theme when no theme is provided.
 *
 * @example
 * // Material Design 3 (default)
 * import { ThemeProvider } from '@onlynative/core'
 *
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * @example
 * // Custom or Apple theme
 * import { ThemeProvider } from '@onlynative/core'
 *
 * <ThemeProvider theme={myTheme}>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme ?? lightTheme}>
      {children}
    </ThemeContext.Provider>
  )
}
