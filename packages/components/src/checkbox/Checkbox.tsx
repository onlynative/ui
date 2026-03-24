import { useMemo } from 'react'
import { Platform, Pressable, View } from 'react-native'
import { useTheme } from '@onlynative/core'

import {
  getMaterialCommunityIcons,
  resolveColorFromStyle,
  resolvePressableStyle,
} from '@onlynative/utils'
import { createStyles } from './styles'
import type { CheckboxProps } from './types'

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

  const MaterialCommunityIcons = isChecked ? getMaterialCommunityIcons() : null

  const theme = useTheme()
  const styles = useMemo(
    () => createStyles(theme, isChecked, containerColor, contentColor),
    [theme, isChecked, containerColor, contentColor],
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
      style={resolvePressableStyle(
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
