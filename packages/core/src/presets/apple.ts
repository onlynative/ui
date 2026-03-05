import { appleLightTheme } from '../theme/apple/light'
import { appleDarkTheme } from '../theme/apple/dark'
import { appleTypography } from '../theme/apple/typography'
import { createAppleComponentTheme } from '../theme/apple/adapter'

/**
 * Apple HIG preset — groups all Apple design system theme values.
 *
 * @example
 * import { apple } from '@onlynative/core'
 *
 * // Use with ThemeProvider for Apple-native theming
 * <ThemeProvider theme={apple.lightTheme}>
 *   <App />
 * </ThemeProvider>
 *
 * // Or use adapter to drive MD3 components with Apple colors
 * <ThemeProvider theme={apple.createComponentTheme(apple.lightTheme)}>
 *   <App />
 * </ThemeProvider>
 */
export const apple = {
  lightTheme: appleLightTheme,
  darkTheme: appleDarkTheme,
  typography: appleTypography,
  createComponentTheme: createAppleComponentTheme,
} as const
