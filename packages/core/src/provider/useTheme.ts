import { useContext } from 'react'

import type { Theme } from '../theme/types'
import { ThemeContext } from './ThemeContext'

/**
 * Returns the current Material Design 3 theme from the nearest `MaterialProvider`.
 *
 * @example
 * const theme = useTheme()
 * <View style={{ backgroundColor: theme.colors.surface }}>
 *   <Text style={theme.typography.bodyMedium}>Hello</Text>
 * </View>
 */
export function useTheme(): Theme {
  return useContext(ThemeContext)
}
