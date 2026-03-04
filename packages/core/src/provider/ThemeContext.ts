import * as React from 'react'

import type { BaseTheme } from '../theme/types'
import { lightTheme } from '../theme/light'

export const ThemeContext = React.createContext<BaseTheme>(lightTheme)
