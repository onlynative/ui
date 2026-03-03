import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useMemo } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from '@onlynative/core'

import { createStyles } from './styles'
import type { SwitchProps } from './types'

interface PressableState {
  pressed: boolean
  hovered?: boolean
}

function resolveStyle(
  trackStyle: StyleProp<ViewStyle>,
  hoveredTrackStyle: StyleProp<ViewStyle>,
  pressedTrackStyle: StyleProp<ViewStyle>,
  disabledTrackStyle: StyleProp<ViewStyle>,
  disabled: boolean,
  style: SwitchProps['style'],
): (state: PressableState) => StyleProp<ViewStyle> {
  if (typeof style === 'function') {
    return (state) => [
      trackStyle,
      state.hovered && !state.pressed && !disabled
        ? hoveredTrackStyle
        : undefined,
      state.pressed && !disabled ? pressedTrackStyle : undefined,
      disabled ? disabledTrackStyle : undefined,
      style(state),
    ]
  }

  return (state) => [
    trackStyle,
    state.hovered && !state.pressed && !disabled
      ? hoveredTrackStyle
      : undefined,
    state.pressed && !disabled ? pressedTrackStyle : undefined,
    disabled ? disabledTrackStyle : undefined,
    style,
  ]
}

export function Switch({
  style,
  value = false,
  onValueChange,
  selectedIcon = 'check',
  unselectedIcon,
  containerColor,
  contentColor,
  disabled = false,
  ...props
}: SwitchProps) {
  const isDisabled = Boolean(disabled)
  const isSelected = Boolean(value)
  const hasIcon = isSelected || Boolean(unselectedIcon)

  const theme = useTheme()
  const styles = useMemo(
    () =>
      createStyles(theme, isSelected, hasIcon, containerColor, contentColor),
    [theme, isSelected, hasIcon, containerColor, contentColor],
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
      onValueChange?.(!isSelected)
    }
  }

  const iconName = isSelected ? selectedIcon : unselectedIcon
  const iconSize = 16

  return (
    <Pressable
      {...props}
      accessibilityRole="switch"
      accessibilityState={{
        disabled: isDisabled,
        checked: isSelected,
      }}
      hitSlop={Platform.OS === 'web' ? undefined : 4}
      disabled={isDisabled}
      onPress={handlePress}
      style={resolveStyle(
        styles.track,
        styles.hoveredTrack,
        styles.pressedTrack,
        styles.disabledTrack,
        isDisabled,
        style,
      )}
    >
      <View
        style={[styles.thumb, isDisabled ? styles.disabledThumb : undefined]}
      >
        {iconName ? (
          <MaterialCommunityIcons
            name={iconName}
            size={iconSize}
            color={resolvedIconColor}
          />
        ) : null}
      </View>
    </Pressable>
  )
}
