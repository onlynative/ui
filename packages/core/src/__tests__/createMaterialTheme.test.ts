import { createMaterialTheme } from '../theme/createMaterialTheme'

const COLOR_KEYS = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'primaryFixed',
  'onPrimaryFixed',
  'primaryFixedDim',
  'onPrimaryFixedVariant',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'secondaryFixed',
  'onSecondaryFixed',
  'secondaryFixedDim',
  'onSecondaryFixedVariant',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'tertiaryFixed',
  'onTertiaryFixed',
  'tertiaryFixedDim',
  'onTertiaryFixedVariant',
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

describe('createMaterialTheme', () => {
  const result = createMaterialTheme('#006A6A')

  it('returns lightTheme and darkTheme', () => {
    expect(result).toHaveProperty('lightTheme')
    expect(result).toHaveProperty('darkTheme')
  })

  it('generates all color roles for light theme', () => {
    for (const key of COLOR_KEYS) {
      expect(result.lightTheme.colors).toHaveProperty(key)
      expect(typeof result.lightTheme.colors[key]).toBe('string')
      expect(result.lightTheme.colors[key]).toMatch(/^#[0-9a-fA-F]{6,8}$/)
    }
  })

  it('generates all color roles for dark theme', () => {
    for (const key of COLOR_KEYS) {
      expect(result.darkTheme.colors).toHaveProperty(key)
      expect(typeof result.darkTheme.colors[key]).toBe('string')
    }
  })

  it('produces different colors for light and dark', () => {
    expect(result.lightTheme.colors.primary).not.toBe(
      result.darkTheme.colors.primary,
    )
    expect(result.lightTheme.colors.surface).not.toBe(
      result.darkTheme.colors.surface,
    )
  })

  it('includes shared non-color tokens', () => {
    expect(result.lightTheme.typography).toBeDefined()
    expect(result.lightTheme.shape).toBeDefined()
    expect(result.lightTheme.spacing).toBeDefined()
    expect(result.lightTheme.elevation).toBeDefined()
    expect(result.lightTheme.motion).toBeDefined()
    expect(result.lightTheme.stateLayer).toBeDefined()
  })

  it('generates different themes for different seed colors', () => {
    const teal = createMaterialTheme('#006A6A')
    const red = createMaterialTheme('#FF0000')
    expect(teal.lightTheme.colors.primary).not.toBe(
      red.lightTheme.colors.primary,
    )
  })
})
