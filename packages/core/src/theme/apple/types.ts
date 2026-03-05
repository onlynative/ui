import type { BaseTheme, TextStyle } from '../types'

/** Apple HIG color roles for light and dark appearances. */
export interface AppleColors {
  [key: string]: string
  /** Primary brand/tint color */
  tint: string
  /** Primary label color — highest contrast text */
  label: string
  /** Secondary label color — subheadings, descriptions */
  secondaryLabel: string
  /** Tertiary label color — placeholder text, disabled controls */
  tertiaryLabel: string
  /** Quaternary label color — lowest contrast text, watermarks */
  quaternaryLabel: string
  /** Elevated grouped background (root level) */
  systemBackground: string
  /** Secondary grouped background (cards, sections) */
  secondarySystemBackground: string
  /** Tertiary grouped background (inner elements) */
  tertiarySystemBackground: string
  /** Non-grouped background (root level) */
  systemGroupedBackground: string
  /** Non-grouped secondary background */
  secondarySystemGroupedBackground: string
  /** Non-grouped tertiary background */
  tertiarySystemGroupedBackground: string
  /** Standard separator line */
  separator: string
  /** Opaque separator line */
  opaqueSeparator: string
  /** Clickable/tappable text */
  link: string
  /** Fill for thin/small elements (switches, sliders) */
  systemFill: string
  /** Fill for medium elements */
  secondarySystemFill: string
  /** Fill for large elements (text fields, search bars) */
  tertiarySystemFill: string
  /** Fill for largest elements */
  quaternarySystemFill: string
  /** System red */
  systemRed: string
  /** System orange */
  systemOrange: string
  /** System yellow */
  systemYellow: string
  /** System green */
  systemGreen: string
  /** System mint */
  systemMint: string
  /** System teal */
  systemTeal: string
  /** System cyan */
  systemCyan: string
  /** System blue */
  systemBlue: string
  /** System indigo */
  systemIndigo: string
  /** System purple */
  systemPurple: string
  /** System pink */
  systemPink: string
  /** System brown */
  systemBrown: string
  /** System gray */
  systemGray: string
  /** System gray 2 */
  systemGray2: string
  /** System gray 3 */
  systemGray3: string
  /** System gray 4 */
  systemGray4: string
  /** System gray 5 */
  systemGray5: string
  /** System gray 6 */
  systemGray6: string
}

/** Apple HIG typography scale following SF Pro conventions. */
export interface AppleTypography {
  [key: string]: TextStyle
  /** Large title — navigation bars, hero headers (34pt) */
  largeTitle: TextStyle
  /** Title 1 — section headers (28pt) */
  title1: TextStyle
  /** Title 2 — subsection headers (22pt) */
  title2: TextStyle
  /** Title 3 — grouped content headers (20pt) */
  title3: TextStyle
  /** Headline — emphasized body text (17pt semibold) */
  headline: TextStyle
  /** Body — standard content text (17pt) */
  body: TextStyle
  /** Callout — secondary content text (16pt) */
  callout: TextStyle
  /** Subheadline — tertiary content text (15pt) */
  subheadline: TextStyle
  /** Footnote — annotations, timestamps (13pt) */
  footnote: TextStyle
  /** Caption 1 — labels, tags (12pt) */
  caption1: TextStyle
  /** Caption 2 — smallest readable text (11pt) */
  caption2: TextStyle
}

/** Apple HIG theme — extends BaseTheme with iOS/macOS system design tokens. */
export interface AppleTheme extends BaseTheme {
  colors: AppleColors
  typography: AppleTypography
}
