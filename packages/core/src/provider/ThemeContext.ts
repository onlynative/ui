import * as React from 'react'
import { lightTheme } from '../theme/light'
import type { BaseTheme } from '../theme/types'

export const ThemeContext = React.createContext<BaseTheme>(lightTheme)
