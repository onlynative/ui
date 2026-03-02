import { useWindowDimensions } from 'react-native'

/**
 * Material Design 3 window size classes.
 * @see https://m3.material.io/foundations/layout/applying-layout/window-size-classes
 */
export type Breakpoint = 'compact' | 'medium' | 'expanded' | 'large' | 'extraLarge'

export const breakpoints = {
  compact: 0,
  medium: 600,
  expanded: 840,
  large: 1200,
  extraLarge: 1600,
} as const

function getBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints.extraLarge) return 'extraLarge'
  if (width >= breakpoints.large) return 'large'
  if (width >= breakpoints.expanded) return 'expanded'
  if (width >= breakpoints.medium) return 'medium'
  return 'compact'
}

/**
 * Returns the current Material Design 3 window size class based on viewport width.
 * Reactively updates when the window is resized.
 *
 * @example
 * const breakpoint = useBreakpoint()
 * const columns = breakpoint === 'compact' ? 2 : 4
 */
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions()
  return getBreakpoint(width)
}
