import { Platform } from 'react-native'

import type { AppleTypography } from './types'

const sfFontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
  default: 'System',
})

/**
 * Apple HIG typography scale following SF Pro conventions.
 * Sizes and weights match the iOS Dynamic Type defaults.
 *
 * @see https://developer.apple.com/design/human-interface-guidelines/typography
 */
export const appleTypography: AppleTypography = {
  largeTitle: {
    fontFamily: sfFontFamily,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
    letterSpacing: 0.37,
  },
  title1: {
    fontFamily: sfFontFamily,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: 0.36,
  },
  title2: {
    fontFamily: sfFontFamily,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: 0.35,
  },
  title3: {
    fontFamily: sfFontFamily,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
    letterSpacing: 0.38,
  },
  headline: {
    fontFamily: sfFontFamily,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  body: {
    fontFamily: sfFontFamily,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  callout: {
    fontFamily: sfFontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  subheadline: {
    fontFamily: sfFontFamily,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  footnote: {
    fontFamily: sfFontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  caption1: {
    fontFamily: sfFontFamily,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0,
  },
  caption2: {
    fontFamily: sfFontFamily,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 13,
    letterSpacing: 0.07,
  },
}
