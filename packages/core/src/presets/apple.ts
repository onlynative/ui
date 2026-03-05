import { appleLightTheme } from '../theme/apple/light'
import { appleDarkTheme } from '../theme/apple/dark'
import { appleTypography } from '../theme/apple/typography'

/**
 * Apple HIG preset — groups all Apple design system theme values.
 *
 * @example
 * import { apple } from '@onlynative/core'
 *
 * <ThemeProvider theme={apple.lightTheme}>
 *   <App />
 * </ThemeProvider>
 */
export const apple = {
  lightTheme: appleLightTheme,
  darkTheme: appleDarkTheme,
  typography: appleTypography,
} as const
