import * as React from 'react'

import type { BaseTheme } from '../theme/types'
import { ThemeContext } from './ThemeContext'

export interface ThemeProviderProps {
  /** Theme object to provide to all child components via context. */
  theme: BaseTheme
  /** Tree of components that will have access to the theme via `useTheme()`. */
  children: React.ReactNode
}

/**
 * Generic theme provider that accepts any theme extending `BaseTheme`.
 * Use this when working with a custom design system.
 * For Material Design 3, prefer `MaterialProvider` which defaults to `lightTheme`.
 *
 * @example
 * import { ThemeProvider, defineTheme } from '@onlynative/core'
 *
 * const myTheme = defineTheme({ ... })
 *
 * <ThemeProvider theme={myTheme}>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  )
}
