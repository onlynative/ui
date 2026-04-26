import { useIconResolver, useTheme } from '@onlynative/core'
import {
  renderIcon,
  resolveColorFromStyle,
  resolvePressableStyle,
} from '@onlynative/utils'
import { useMemo } from 'react'
import { Platform, Pressable, View } from 'react-native'
import { createStyles } from './styles'
import type { CheckboxProps } from './types'

export function Checkbox({
  style,
  value = false,
  onValueChange,
  checkIcon = 'check',
  containerColor,
  contentColor,
  disabled = false,
  ...props
}: CheckboxProps) {
  const isDisabled = Boolean(disabled)
  const isChecked = Boolean(value)

  const theme = useTheme()
  const iconResolver = useIconResolver()
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
        {isChecked
          ? renderIcon(
              checkIcon,
              { size: 14, color: resolvedIconColor },
              iconResolver,
            )
          : null}
      </View>
    </Pressable>
  )
}
