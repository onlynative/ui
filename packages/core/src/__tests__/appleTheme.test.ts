import { appleLightTheme } from '../theme/apple/light'
import { appleDarkTheme } from '../theme/apple/dark'
import { appleTypography } from '../theme/apple/typography'
import { createAppleComponentTheme } from '../theme/apple/adapter'
import { apple } from '../presets/apple'

const COLOR_KEYS = [
  'tint',
  'label',
  'secondaryLabel',
  'tertiaryLabel',
  'quaternaryLabel',
  'systemBackground',
  'secondarySystemBackground',
  'tertiarySystemBackground',
  'systemGroupedBackground',
  'secondarySystemGroupedBackground',
  'tertiarySystemGroupedBackground',
  'separator',
  'opaqueSeparator',
  'link',
  'systemFill',
  'secondarySystemFill',
  'tertiarySystemFill',
  'quaternarySystemFill',
  'systemRed',
  'systemOrange',
  'systemYellow',
  'systemGreen',
  'systemMint',
  'systemTeal',
  'systemCyan',
  'systemBlue',
  'systemIndigo',
  'systemPurple',
  'systemPink',
  'systemBrown',
  'systemGray',
  'systemGray2',
  'systemGray3',
  'systemGray4',
  'systemGray5',
  'systemGray6',
]

const TYPOGRAPHY_KEYS = [
  'largeTitle',
  'title1',
  'title2',
  'title3',
  'headline',
  'body',
  'callout',
  'subheadline',
  'footnote',
  'caption1',
  'caption2',
]

describe('Apple HIG theme', () => {
  it('light theme has all color roles', () => {
    for (const key of COLOR_KEYS) {
      expect(appleLightTheme.colors).toHaveProperty(key)
      expect(typeof appleLightTheme.colors[key]).toBe('string')
      expect(appleLightTheme.colors[key]).toMatch(/^#[0-9a-fA-F]{6,8}$/)
    }
  })

  it('dark theme has all color roles', () => {
    for (const key of COLOR_KEYS) {
      expect(appleDarkTheme.colors).toHaveProperty(key)
      expect(typeof appleDarkTheme.colors[key]).toBe('string')
      expect(appleDarkTheme.colors[key]).toMatch(/^#[0-9a-fA-F]{6,8}$/)
    }
  })

  it('light and dark themes have different colors', () => {
    expect(appleLightTheme.colors.label).not.toBe(appleDarkTheme.colors.label)
    expect(appleLightTheme.colors.systemBackground).not.toBe(
      appleDarkTheme.colors.systemBackground,
    )
    expect(appleLightTheme.colors.tint).not.toBe(appleDarkTheme.colors.tint)
  })

  it('typography has all 11 text styles', () => {
    for (const key of TYPOGRAPHY_KEYS) {
      expect(appleTypography).toHaveProperty(key)
      const style = appleTypography[key]
      expect(style).toHaveProperty('fontFamily')
      expect(style).toHaveProperty('fontSize')
      expect(style).toHaveProperty('fontWeight')
      expect(style).toHaveProperty('lineHeight')
      expect(style).toHaveProperty('letterSpacing')
    }
  })

  it('includes shared non-color tokens', () => {
    expect(appleLightTheme.shape).toBeDefined()
    expect(appleLightTheme.spacing).toBeDefined()
    expect(appleLightTheme.elevation).toBeDefined()
    expect(appleLightTheme.motion).toBeDefined()
    expect(appleLightTheme.stateLayer).toBeDefined()
  })

  it('apple preset groups all values', () => {
    expect(apple.lightTheme).toBe(appleLightTheme)
    expect(apple.darkTheme).toBe(appleDarkTheme)
    expect(apple.typography).toBe(appleTypography)
    expect(apple.createComponentTheme).toBe(createAppleComponentTheme)
  })
})

const MD3_COLOR_KEYS = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'background',
  'onBackground',
  'surface',
  'surfaceDim',
  'surfaceBright',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'outline',
  'outlineVariant',
  'surfaceTint',
  'shadow',
  'scrim',
  'inverseSurface',
  'inverseOnSurface',
  'inversePrimary',
]

const MD3_TYPOGRAPHY_KEYS = [
  'displayLarge',
  'displayMedium',
  'displaySmall',
  'headlineLarge',
  'headlineMedium',
  'headlineSmall',
  'titleLarge',
  'titleMedium',
  'titleSmall',
  'bodyLarge',
  'bodyMedium',
  'bodySmall',
  'labelLarge',
  'labelMedium',
  'labelSmall',
]

describe('createAppleComponentTheme', () => {
  const lightResult = createAppleComponentTheme(appleLightTheme)
  const darkResult = createAppleComponentTheme(appleDarkTheme)

  it('produces all MD3 color roles from light Apple theme', () => {
    for (const key of MD3_COLOR_KEYS) {
      expect(lightResult.colors).toHaveProperty(key)
      expect(typeof lightResult.colors[key]).toBe('string')
    }
  })

  it('produces all MD3 color roles from dark Apple theme', () => {
    for (const key of MD3_COLOR_KEYS) {
      expect(darkResult.colors).toHaveProperty(key)
      expect(typeof darkResult.colors[key]).toBe('string')
    }
  })

  it('maps tint to primary', () => {
    expect(lightResult.colors.primary).toBe(appleLightTheme.colors.tint)
    expect(darkResult.colors.primary).toBe(appleDarkTheme.colors.tint)
  })

  it('maps label to onSurface', () => {
    expect(lightResult.colors.onSurface).toBe(appleLightTheme.colors.label)
  })

  it('maps systemRed to error', () => {
    expect(lightResult.colors.error).toBe(appleLightTheme.colors.systemRed)
  })

  it('maps systemBackground to surface', () => {
    expect(lightResult.colors.surface).toBe(
      appleLightTheme.colors.systemBackground,
    )
  })

  it('produces all 15 MD3 typography variants', () => {
    for (const key of MD3_TYPOGRAPHY_KEYS) {
      expect(lightResult.typography).toHaveProperty(key)
      const style = lightResult.typography[key]
      expect(style).toHaveProperty('fontFamily')
      expect(style).toHaveProperty('fontSize')
    }
  })

  it('light and dark produce different colors', () => {
    expect(lightResult.colors.primary).not.toBe(darkResult.colors.primary)
    expect(lightResult.colors.surface).not.toBe(darkResult.colors.surface)
  })

  it('preserves shared tokens from Apple theme', () => {
    expect(lightResult.shape).toBe(appleLightTheme.shape)
    expect(lightResult.spacing).toBe(appleLightTheme.spacing)
    expect(lightResult.stateLayer).toBe(appleLightTheme.stateLayer)
    expect(lightResult.elevation).toBe(appleLightTheme.elevation)
    expect(lightResult.motion).toBe(appleLightTheme.motion)
  })
})
