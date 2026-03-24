import { StyleSheet } from 'react-native'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface PressableState {
  pressed: boolean
  hovered?: boolean
}

export type PressableStyleProp =
  | StyleProp<ViewStyle>
  | ((state: PressableState) => StyleProp<ViewStyle>)

export function resolvePressableStyle(
  base: StyleProp<ViewStyle>,
  hovered: StyleProp<ViewStyle>,
  pressed: StyleProp<ViewStyle>,
  disabled: StyleProp<ViewStyle>,
  isDisabled: boolean,
  style: PressableStyleProp | undefined,
): (state: PressableState) => StyleProp<ViewStyle> {
  if (typeof style === 'function') {
    return (state) => [
      base,
      state.hovered && !state.pressed && !isDisabled ? hovered : undefined,
      state.pressed && !isDisabled ? pressed : undefined,
      isDisabled ? disabled : undefined,
      style(state),
    ]
  }

  return (state) => [
    base,
    state.hovered && !state.pressed && !isDisabled ? hovered : undefined,
    state.pressed && !isDisabled ? pressed : undefined,
    isDisabled ? disabled : undefined,
    style,
  ]
}

export function resolveColorFromStyle(
  ...styles: (StyleProp<TextStyle> | undefined)[]
): string | undefined {
  const flattened = StyleSheet.flatten(styles as StyleProp<TextStyle>)
  return typeof flattened?.color === 'string' ? flattened.color : undefined
}
