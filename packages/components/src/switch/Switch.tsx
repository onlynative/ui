import { useIconResolver, useTheme } from '@onlynative/core'
import {
  renderIcon,
  resolveColorFromStyle,
  resolvePressableStyle,
} from '@onlynative/utils'
import { useMemo } from 'react'
import { Platform, Pressable, View } from 'react-native'
import { createStyles } from './styles'
import type { SwitchProps } from './types'

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
  const activeIcon = isSelected ? selectedIcon : unselectedIcon
  const hasIcon = Boolean(activeIcon)

  const theme = useTheme()
  const iconResolver = useIconResolver()
  const styles = useMemo(
    () =>
      createStyles(theme, isSelected, hasIcon, containerColor, contentColor),
    [theme, isSelected, hasIcon, containerColor, contentColor],
  )

  const resolvedIconColor = useMemo(
    () =>
      resolveColorFromStyle(
        styles.iconColor,
        isDisabled ? styles.disabledIconColor : undefined,
      ),
    [styles.iconColor, styles.disabledIconColor, isDisabled],
  )

  const handlePress = () => {
    if (!isDisabled) {
      onValueChange?.(!isSelected)
    }
  }

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
      style={resolvePressableStyle(
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
        {activeIcon
          ? renderIcon(
              activeIcon,
              { size: iconSize, color: resolvedIconColor },
              iconResolver,
            )
          : null}
      </View>
    </Pressable>
  )
}
