import {
  argbFromHex,
  hexFromArgb,
  Hct,
  SchemeTonalSpot,
  MaterialDynamicColors,
} from '@material/material-color-utilities'
import type { DynamicScheme } from '@material/material-color-utilities'
import { applyRoundness } from './applyRoundness'
import { lightTheme } from './light'
import { defaultTopAppBarTokens } from './topAppBar'
import type { Colors, Theme, Typography } from './types'
import { defaultTypography } from './typography'

export interface CreateMaterialThemeOptions {
  /** Custom font family applied to all typography styles. When omitted, platform defaults are used (Roboto on Android, System on iOS). */
  fontFamily?: string
  /** Global corner-radius multiplier. `0` = sharp, `1` = default MD3, `2` = double rounding. @default 1 */
  roundness?: number
}

function extractColors(scheme: DynamicScheme): Colors {
  const c = new MaterialDynamicColors()
  return {
    primary: hexFromArgb(c.primary().getArgb(scheme)),
    onPrimary: hexFromArgb(c.onPrimary().getArgb(scheme)),
    primaryContainer: hexFromArgb(c.primaryContainer().getArgb(scheme)),
    onPrimaryContainer: hexFromArgb(c.onPrimaryContainer().getArgb(scheme)),
    primaryFixed: hexFromArgb(c.primaryFixed().getArgb(scheme)),
    onPrimaryFixed: hexFromArgb(c.onPrimaryFixed().getArgb(scheme)),
    primaryFixedDim: hexFromArgb(c.primaryFixedDim().getArgb(scheme)),
    onPrimaryFixedVariant: hexFromArgb(
      c.onPrimaryFixedVariant().getArgb(scheme),
    ),
    secondary: hexFromArgb(c.secondary().getArgb(scheme)),
    onSecondary: hexFromArgb(c.onSecondary().getArgb(scheme)),
    secondaryContainer: hexFromArgb(c.secondaryContainer().getArgb(scheme)),
    onSecondaryContainer: hexFromArgb(c.onSecondaryContainer().getArgb(scheme)),
    secondaryFixed: hexFromArgb(c.secondaryFixed().getArgb(scheme)),
    onSecondaryFixed: hexFromArgb(c.onSecondaryFixed().getArgb(scheme)),
    secondaryFixedDim: hexFromArgb(c.secondaryFixedDim().getArgb(scheme)),
    onSecondaryFixedVariant: hexFromArgb(
      c.onSecondaryFixedVariant().getArgb(scheme),
    ),
    tertiary: hexFromArgb(c.tertiary().getArgb(scheme)),
    onTertiary: hexFromArgb(c.onTertiary().getArgb(scheme)),
    tertiaryContainer: hexFromArgb(c.tertiaryContainer().getArgb(scheme)),
    onTertiaryContainer: hexFromArgb(c.onTertiaryContainer().getArgb(scheme)),
    tertiaryFixed: hexFromArgb(c.tertiaryFixed().getArgb(scheme)),
    onTertiaryFixed: hexFromArgb(c.onTertiaryFixed().getArgb(scheme)),
    tertiaryFixedDim: hexFromArgb(c.tertiaryFixedDim().getArgb(scheme)),
    onTertiaryFixedVariant: hexFromArgb(
      c.onTertiaryFixedVariant().getArgb(scheme),
    ),
    error: hexFromArgb(c.error().getArgb(scheme)),
    onError: hexFromArgb(c.onError().getArgb(scheme)),
    errorContainer: hexFromArgb(c.errorContainer().getArgb(scheme)),
    onErrorContainer: hexFromArgb(c.onErrorContainer().getArgb(scheme)),
    background: hexFromArgb(c.background().getArgb(scheme)),
    onBackground: hexFromArgb(c.onBackground().getArgb(scheme)),
    surface: hexFromArgb(c.surface().getArgb(scheme)),
    surfaceDim: hexFromArgb(c.surfaceDim().getArgb(scheme)),
    surfaceBright: hexFromArgb(c.surfaceBright().getArgb(scheme)),
    surfaceContainerLowest: hexFromArgb(
      c.surfaceContainerLowest().getArgb(scheme),
    ),
    surfaceContainerLow: hexFromArgb(c.surfaceContainerLow().getArgb(scheme)),
    surfaceContainer: hexFromArgb(c.surfaceContainer().getArgb(scheme)),
    surfaceContainerHigh: hexFromArgb(c.surfaceContainerHigh().getArgb(scheme)),
    surfaceContainerHighest: hexFromArgb(
      c.surfaceContainerHighest().getArgb(scheme),
    ),
    onSurface: hexFromArgb(c.onSurface().getArgb(scheme)),
    surfaceVariant: hexFromArgb(c.surfaceVariant().getArgb(scheme)),
    onSurfaceVariant: hexFromArgb(c.onSurfaceVariant().getArgb(scheme)),
    outline: hexFromArgb(c.outline().getArgb(scheme)),
    outlineVariant: hexFromArgb(c.outlineVariant().getArgb(scheme)),
    surfaceTint: hexFromArgb(c.surfaceTint().getArgb(scheme)),
    shadow: hexFromArgb(c.shadow().getArgb(scheme)),
    scrim: hexFromArgb(c.scrim().getArgb(scheme)),
    inverseSurface: hexFromArgb(c.inverseSurface().getArgb(scheme)),
    inverseOnSurface: hexFromArgb(c.inverseOnSurface().getArgb(scheme)),
    inversePrimary: hexFromArgb(c.inversePrimary().getArgb(scheme)),
  }
}

/**
 * Generates a complete Material Design 3 light and dark theme from a single seed color.
 * Uses Google's HCT color space for spec-compliant palette generation.
 *
 * @param seedColor - Hex color string (e.g. '#6750A4', '#FF0000')
 * @returns Object with `lightTheme` and `darkTheme`, both typed as `Theme`
 *
 * @example
 * import { createMaterialTheme } from '@onlynative/core/create-theme'
 *
 * const { lightTheme, darkTheme } = createMaterialTheme('#006A6A')
 *
 * // Custom font
 * const { lightTheme, darkTheme } = createMaterialTheme('#006A6A', { fontFamily: 'Inter' })
 *
 * // Sharp corners
 * const { lightTheme, darkTheme } = createMaterialTheme('#006A6A', { roundness: 0 })
 *
 * <ThemeProvider theme={lightTheme}>
 *   <App />
 * </ThemeProvider>
 */
export function createMaterialTheme(
  seedColor: string,
  options?: CreateMaterialThemeOptions,
): {
  lightTheme: Theme
  darkTheme: Theme
} {
  const sourceHct = Hct.fromInt(argbFromHex(seedColor))
  const { fontFamily, roundness = 1 } = options ?? {}

  const lightScheme = new SchemeTonalSpot(sourceHct, false, 0)
  const darkScheme = new SchemeTonalSpot(sourceHct, true, 0)

  const shape = roundness === 1 ? lightTheme.shape : applyRoundness(roundness)

  const typography = fontFamily
    ? (Object.fromEntries(
        Object.entries(defaultTypography).map(([key, style]) => [
          key,
          { ...style, fontFamily },
        ]),
      ) as Typography)
    : defaultTypography

  const shared = {
    typography,
    shape,
    spacing: lightTheme.spacing,
    topAppBar: defaultTopAppBarTokens,
    stateLayer: lightTheme.stateLayer,
    elevation: lightTheme.elevation,
    motion: lightTheme.motion,
  }

  return {
    lightTheme: { colors: extractColors(lightScheme), ...shared },
    darkTheme: { colors: extractColors(darkScheme), ...shared },
  }
}
