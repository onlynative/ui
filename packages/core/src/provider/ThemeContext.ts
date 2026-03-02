import * as React from 'react'

import type { Theme } from '../theme/types'
import { lightTheme } from '../theme/light'

export const ThemeContext = React.createContext<Theme>(lightTheme)
