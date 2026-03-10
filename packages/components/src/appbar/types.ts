import type { ReactNode } from 'react'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'
import type { IconButtonProps } from '../icon-button'

/** Size/layout variant of the AppBar. */
export type AppBarVariant = 'small' | 'center-aligned' | 'medium' | 'large'

/**
 * Color scheme that determines the default container and content colors.
 *
 * - `'surface'` — `surface` / `onSurface` (default, elevated uses `surfaceContainer`)
 * - `'surfaceContainerLowest'` — `surfaceContainerLowest` / `onSurface`
 * - `'surfaceContainerLow'` — `surfaceContainerLow` / `onSurface`
 * - `'surfaceContainer'` — `surfaceContainer` / `onSurface`
 * - `'surfaceContainerHigh'` — `surfaceContainerHigh` / `onSurface`
 * - `'surfaceContainerHighest'` — `surfaceContainerHighest` / `onSurface`
 * - `'primary'` — `primary` / `onPrimary`
 * - `'primaryContainer'` — `primaryContainer` / `onPrimaryContainer`
 */
export type AppBarColorScheme =
  | 'surface'
  | 'surfaceContainerLowest'
  | 'surfaceContainerLow'
  | 'surfaceContainer'
  | 'surfaceContainerHigh'
  | 'surfaceContainerHighest'
  | 'primary'
  | 'primaryContainer'

/** A single action item rendered in the AppBar trailing slot. */
export interface AppBarAction {
  /** MaterialCommunityIcons icon name to render. */
  icon: IconButtonProps['icon']
  /** Accessibility label for screen readers (required). */
  accessibilityLabel: string
  /** Called when the action icon is pressed. */
  onPress?: () => void
  /**
   * Disables the action icon.
   * @default false
   */
  disabled?: boolean
}

export interface AppBarProps {
  /** Title text displayed in the bar. */
  title: string
  /**
   * Layout variant.
   * @default 'small'
   */
  variant?: AppBarVariant
  /**
   * Color scheme that determines the default container and content colors.
   * `containerColor` and `contentColor` props override these defaults.
   * @default 'surface'
   */
  colorScheme?: AppBarColorScheme
  /**
   * When `true`, renders a back button in the leading slot.
   * @default false
   */
  canGoBack?: boolean
  /** Called when the auto-rendered back button is pressed. */
  onBackPress?: () => void
  /**
   * When `true`, wraps the bar in a SafeAreaView that handles the top inset.
   * @default false
   */
  insetTop?: boolean
  /**
   * When `true`, adds shadow/elevation to indicate the bar is scrolled.
   * @default false
   */
  elevated?: boolean
  /** Custom leading content. When provided, overrides `canGoBack`. */
  leading?: ReactNode
  /** Custom trailing content. When provided, overrides `actions`. */
  trailing?: ReactNode
  /** Array of icon-button actions rendered in the trailing slot. */
  actions?: AppBarAction[]
  /**
   * Override the container (background) color.
   * Applied to both normal and elevated states.
   */
  containerColor?: string
  /**
   * Override the content (title and icon) color.
   */
  contentColor?: string
  /** Additional style applied to the title text. */
  titleStyle?: StyleProp<TextStyle>
  /** Custom style applied to the root container. */
  style?: StyleProp<ViewStyle>
}
