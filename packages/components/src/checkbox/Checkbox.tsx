import { useMemo } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from '@onlynative/core'

import { getMaterialCommunityIcons } from '../utils/icon'
import { createStyles } from './styles'
import type { CheckboxProps } from './types'

interface PressableState {
  pressed: boolean
  hovered?: boolean
}

function resolveStyle(
  containerStyle: StyleProp<ViewStyle>,
  hoveredContainerStyle: StyleProp<ViewStyle>,
  pressedContainerStyle: StyleProp<ViewStyle>,
  disabledContainerStyle: StyleProp<ViewStyle>,
  disabled: boolean,
  style: CheckboxProps['style'],
): (state: PressableState) => StyleProp<ViewStyle> {
  if (typeof style === 'function') {
    return (state) => [
      containerStyle,
      state.hovered && !state.pressed && !disabled
        ? hoveredContainerStyle
        : undefined,
      state.pressed && !disabled ? pressedContainerStyle : undefined,
      disabled ? disabledContainerStyle : undefined,
      style(state),
    ]
  }

  return (state) => [
    containerStyle,
    state.hovered && !state.pressed && !disabled
      ? hoveredContainerStyle
      : undefined,
    state.pressed && !disabled ? pressedContainerStyle : undefined,
    disabled ? disabledContainerStyle : undefined,
    style,
  ]
}

export function Checkbox({
  style,
  value = false,
  onValueChange,
  containerColor,
  contentColor,
  disabled = false,
  ...props
}: CheckboxProps) {
  const isDisabled = Boolean(disabled)
  const isChecked = Boolean(value)

  const MaterialCommunityIcons = isChecked
    ? getMaterialCommunityIcons()
    : null

  const theme = useTheme()
  const styles = useMemo(
    () => createStyles(theme, isChecked, containerColor, contentColor),
    [theme, isChecked, containerColor, contentColor],
  )

  const resolvedIconColor = useMemo(() => {
    const base = StyleSheet.flatten([
      styles.iconColor,
      isDisabled ? styles.disabledIconColor : undefined,
    ])
    return typeof base?.color === 'string' ? base.color : undefined
  }, [styles.iconColor, styles.disabledIconColor, isDisabled])

  const handlePress = () => {
    if (!isDisabled) {
      onValueChange?.(!isChecked)
    }
  }

  return (
    <Pressable
      {...props}
      accessibilityRole="checkbox"
      accessibilityState={{
        disabled: isDisabled,
        checked: isChecked,
      }}
      hitSlop={Platform.OS === 'web' ? undefined : 4}
      disabled={isDisabled}
      onPress={handlePress}
      style={resolveStyle(
        styles.container,
        styles.hoveredContainer,
        styles.pressedContainer,
        styles.disabledContainer,
        isDisabled,
        style,
      )}
    >
      <View style={[styles.box, isDisabled ? styles.disabledBox : undefined]}>
        {isChecked ? (
          <MaterialCommunityIcons
            name="check"
            size={14}
            color={resolvedIconColor}
          />
        ) : null}
      </View>
    </Pressable>
  )
}
