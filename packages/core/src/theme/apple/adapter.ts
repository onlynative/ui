import type { Theme, Colors } from '../types'
import type { AppleTheme } from './types'
import { defaultTypography } from '../typography'
import { defaultTopAppBarTokens } from '../topAppBar'

/**
 * Maps Apple HIG color roles to MD3-compatible color names.
 * This lets existing `@onlynative/components` (which reference MD3 color roles)
 * render correctly when given an Apple-sourced theme.
 */
function mapAppleColorsToMaterial(c: AppleTheme['colors']): Colors {
  return {
    // Primary — maps to tint (the app's accent color)
    primary: c.tint,
    onPrimary: c.systemBackground,
    primaryContainer: c.quaternarySystemFill,
    onPrimaryContainer: c.tint,
    primaryFixed: c.quaternarySystemFill,
    onPrimaryFixed: c.tint,
    primaryFixedDim: c.tertiarySystemFill,
    onPrimaryFixedVariant: c.tint,

    // Secondary — maps to system gray fills
    secondary: c.secondaryLabel,
    onSecondary: c.systemBackground,
    secondaryContainer: c.systemGray6,
    onSecondaryContainer: c.label,
    secondaryFixed: c.systemGray6,
    onSecondaryFixed: c.label,
    secondaryFixedDim: c.systemGray5,
    onSecondaryFixedVariant: c.secondaryLabel,

    // Tertiary — maps to system indigo
    tertiary: c.systemIndigo,
    onTertiary: c.systemBackground,
    tertiaryContainer: c.systemGray6,
    onTertiaryContainer: c.systemIndigo,
    tertiaryFixed: c.systemGray6,
    onTertiaryFixed: c.systemIndigo,
    tertiaryFixedDim: c.systemGray5,
    onTertiaryFixedVariant: c.systemIndigo,

    // Error — maps to system red
    error: c.systemRed,
    onError: c.systemBackground,
    errorContainer: c.systemGray6,
    onErrorContainer: c.systemRed,

    // Background
    background: c.systemBackground,
    onBackground: c.label,

    // Surface hierarchy — maps to Apple's layered background system
    surface: c.systemBackground,
    surfaceDim: c.systemGroupedBackground,
    surfaceBright: c.systemBackground,
    surfaceContainerLowest: c.systemBackground,
    surfaceContainerLow: c.secondarySystemGroupedBackground,
    surfaceContainer: c.secondarySystemBackground,
    surfaceContainerHigh: c.tertiarySystemBackground,
    surfaceContainerHighest: c.tertiarySystemGroupedBackground,
    onSurface: c.label,
    surfaceVariant: c.systemGray6,
    onSurfaceVariant: c.secondaryLabel,

    // Outline — maps to separators
    outline: c.separator,
    outlineVariant: c.opaqueSeparator,

    // Misc
    surfaceTint: c.tint,
    shadow: '#000000',
    scrim: '#000000',

    // Inverse (for snackbars, etc.)
    inverseSurface: c.label,
    inverseOnSurface: c.systemBackground,
    inversePrimary: c.tint,
  }
}

/**
 * Creates an MD3-compatible `Theme` from an `AppleTheme`.
 *
 * This adapter maps Apple HIG color roles (tint, label, systemBackground, etc.)
 * to Material Design 3 color names (primary, onSurface, surface, etc.) so that
 * existing `@onlynative/components` render correctly with Apple-sourced colors.
 *
 * Typography is mapped to the MD3 type scale using the Apple theme's font family.
 *
 * @param appleTheme - An Apple HIG theme (light or dark)
 * @returns A `Theme` object compatible with `ThemeProvider` and all components
 *
 * @example
 * import { createAppleComponentTheme, appleLightTheme, ThemeProvider } from '@onlynative/core'
 *
 * const theme = createAppleComponentTheme(appleLightTheme)
 *
 * <ThemeProvider theme={theme}>
 *   <Button variant="filled">Works with Apple colors</Button>
 * </ThemeProvider>
 */
export function createAppleComponentTheme(appleTheme: AppleTheme): Theme {
  const fontFamily = appleTheme.typography.body.fontFamily

  return {
    colors: mapAppleColorsToMaterial(appleTheme.colors),
    typography: {
      displayLarge: {
        ...defaultTypography.displayLarge,
        fontFamily,
      },
      displayMedium: {
        ...defaultTypography.displayMedium,
        fontFamily,
      },
      displaySmall: {
        ...appleTheme.typography.largeTitle,
        fontWeight: '400',
      },
      headlineLarge: appleTheme.typography.title1,
      headlineMedium: appleTheme.typography.title2,
      headlineSmall: appleTheme.typography.title3,
      titleLarge: appleTheme.typography.title3,
      titleMedium: appleTheme.typography.headline,
      titleSmall: appleTheme.typography.subheadline,
      bodyLarge: appleTheme.typography.body,
      bodyMedium: appleTheme.typography.callout,
      bodySmall: appleTheme.typography.footnote,
      labelLarge: appleTheme.typography.subheadline,
      labelMedium: appleTheme.typography.caption1,
      labelSmall: appleTheme.typography.caption2,
    },
    shape: appleTheme.shape,
    spacing: appleTheme.spacing,
    topAppBar: defaultTopAppBarTokens,
    stateLayer: appleTheme.stateLayer,
    elevation: appleTheme.elevation,
    motion: appleTheme.motion,
  }
}
