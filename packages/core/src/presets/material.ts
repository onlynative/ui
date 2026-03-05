import { lightTheme } from '../theme/light'
import { darkTheme } from '../theme/dark'
import { defaultTopAppBarTokens } from '../theme/topAppBar'
import { createMaterialTheme } from '../theme/createMaterialTheme'

/**
 * Material Design 3 preset — groups all MD3-specific theme values.
 *
 * @example
 * import { material } from '@onlynative/core'
 *
 * <MaterialProvider theme={material.darkTheme}>
 *   <App />
 * </MaterialProvider>
 */
export const material = {
  lightTheme,
  darkTheme,
  defaultTopAppBarTokens,
  createMaterialTheme,
} as const
