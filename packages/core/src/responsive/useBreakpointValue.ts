import { useBreakpoint } from './useBreakpoint'
import type { Breakpoint } from './useBreakpoint'

/** A partial map from breakpoint names to values. Unset breakpoints fall back to the nearest smaller one. */
export type BreakpointValues<T> = Partial<Record<Breakpoint, T>> &
  Record<'compact', T>

const order: Breakpoint[] = [
  'compact',
  'medium',
  'expanded',
  'large',
  'extraLarge',
]

/**
 * Returns a value based on the current breakpoint, cascading down to the
 * nearest smaller breakpoint when no exact match is set.
 *
 * @example
 * const columns = useBreakpointValue({ compact: 1, medium: 2, expanded: 4 })
 * // compact → 1, medium → 2, expanded/large/extraLarge → 4
 */
export function useBreakpointValue<T>(values: BreakpointValues<T>): T {
  const breakpoint = useBreakpoint()
  const idx = order.indexOf(breakpoint)

  for (let i = idx; i >= 0; i--) {
    const key = order[i]
    if (key in values) return values[key] as T
  }

  return values.compact
}
