import { StyleSheet } from 'react-native'

/**
 * Returns the flattened style object from a rendered element.
 *
 * Replaces the verbose `StyleSheet.flatten(element.props.style)` pattern.
 *
 * @example
 * const button = screen.getByRole('button')
 * expect(getStyle(button).backgroundColor).toBe('#FF0000')
 */
export function getStyle(element: {
  props: { style?: unknown }
}): Record<string, unknown> {
  return (StyleSheet.flatten(element.props.style as never) ?? {}) as Record<
    string,
    unknown
  >
}
