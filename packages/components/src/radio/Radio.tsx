import { useMemo } from 'react'
import { Platform, Pressable, View } from 'react-native'
import { useTheme } from '@onlynative/core'

import { resolvePressableStyle } from '@onlynative/utils'
import { createStyles } from './styles'
import type { RadioProps } from './types'

export function Radio({
  style,
  value = false,
  onValueChange,
  containerColor,
  contentColor,
  disabled = false,
  ...props
}: RadioProps) {
  const isDisabled = Boolean(disabled)
  const isSelected = Boolean(value)

  const theme = useTheme()
  const styles = useMemo(
    () => createStyles(theme, isSelected, containerColor, contentColor),
    [theme, isSelected, containerColor, contentColor],
  )

  const handlePress = () => {
    if (!isDisabled) {
      onValueChange?.(!isSelected)
    }
  }

  return (
    <Pressable
      {...props}
      accessibilityRole="radio"
      accessibilityState={{
        disabled: isDisabled,
        checked: isSelected,
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
      <View
        style={[styles.outer, isDisabled ? styles.disabledOuter : undefined]}
      >
        {isSelected ? (
          <View
            style={[
              styles.inner,
              isDisabled ? styles.disabledInner : undefined,
            ]}
          />
        ) : null}
      </View>
    </Pressable>
  )
}
