import { useMemo } from 'react'
import { Platform, Pressable, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from '@onlynative/core'

import { createStyles } from './styles'
import type { CardProps } from './types'

interface PressableState {
  pressed: boolean
  hovered?: boolean
}

export function Card({
  children,
  style,
  variant = 'elevated',
  onPress,
  disabled = false,
  containerColor,
  ...props
}: CardProps) {
  const isDisabled = Boolean(disabled)
  const isInteractive = onPress !== undefined
  const theme = useTheme()
  const styles = useMemo(
    () => createStyles(theme, variant, containerColor),
    [theme, variant, containerColor],
  )

  if (!isInteractive) {
    return (
      <View {...props} style={[styles.container, style]}>
        {children}
      </View>
    )
  }

  const resolvedStyle = (state: PressableState): StyleProp<ViewStyle> => [
    styles.container,
    styles.interactiveContainer,
    state.hovered && !state.pressed && !isDisabled
      ? styles.hoveredContainer
      : undefined,
    state.pressed && !isDisabled ? styles.pressedContainer : undefined,
    isDisabled ? styles.disabledContainer : undefined,
    typeof style === 'function'
      ? (style as (state: PressableState) => ViewStyle)(state)
      : style,
  ]

  return (
    <Pressable
      {...props}
      role="button"
      accessibilityState={{ disabled: isDisabled }}
      hitSlop={Platform.OS === 'web' ? undefined : 4}
      disabled={isDisabled}
      onPress={onPress}
      style={resolvedStyle}
    >
      {isDisabled ? (
        <View style={styles.disabledContent}>{children}</View>
      ) : (
        children
      )}
    </Pressable>
  )
}
