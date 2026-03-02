import * as React from 'react'

import type { Theme } from '../theme/types'
import { lightTheme } from '../theme/light'
import { ThemeContext } from './ThemeContext'

export interface MaterialProviderProps {
  /**
   * Theme object to provide to all child components via context.
   * @default lightTheme
   */
  theme?: Theme
  /** Tree of components that will have access to the theme via `useTheme()`. */
  children: React.ReactNode
}

export function MaterialProvider({ theme, children }: MaterialProviderProps) {
  return (
    <ThemeContext.Provider value={theme ?? lightTheme}>
      {children}
    </ThemeContext.Provider>
  )
}
