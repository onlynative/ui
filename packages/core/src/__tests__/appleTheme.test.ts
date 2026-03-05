import { appleLightTheme } from '../theme/apple/light'
import { appleDarkTheme } from '../theme/apple/dark'
import { appleTypography } from '../theme/apple/typography'
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
  })
})
