import { useContext } from 'react'

import type { Theme } from '../theme/types'
import { ThemeContext } from './ThemeContext'

export function useTheme(): Theme {
  return useContext(ThemeContext)
}
