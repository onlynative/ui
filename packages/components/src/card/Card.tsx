import { useMemo } from 'react'
import { Platform, Pressable, View } from 'react-native'
import { useTheme } from '@onlynative/core'

import { resolvePressableStyle } from '@onlynative/utils'
import { createStyles } from './styles'
import type { CardProps } from './types'

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

  return (
    <Pressable
      {...props}
      role="button"
      accessibilityState={{ disabled: isDisabled }}
      hitSlop={Platform.OS === 'web' ? undefined : 4}
      disabled={isDisabled}
      onPress={onPress}
      style={resolvePressableStyle(
        [styles.container, styles.interactiveContainer],
        styles.hoveredContainer,
        styles.pressedContainer,
        styles.disabledContainer,
        isDisabled,
        style,
      )}
    >
      {isDisabled ? (
        <View style={styles.disabledContent}>{children}</View>
      ) : (
        children
      )}
    </Pressable>
  )
}
