import { I18nManager } from 'react-native'

/**
 * Returns the appropriate transform origin for animations that scale
 * from a horizontal edge (e.g. label shrink in TextField).
 */
export function transformOrigin(
  vertical: 'top' | 'center' | 'bottom' = 'top',
): string {
  return I18nManager.isRTL ? `right ${vertical}` : `left ${vertical}`
}

/**
 * Picks a value based on layout direction.
 * Useful for selecting mirrored icons or other direction-dependent values.
 */
export function selectRTL<T>(ltr: T, rtl: T): T {
  return I18nManager.isRTL ? rtl : ltr
}
