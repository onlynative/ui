import { useTheme } from '@onlynative/core'
import { Motion } from '@onlynative/inertia'
import { useMemo } from 'react'
import { Platform, View } from 'react-native'
import { useStateLayer } from '../internal/useStateLayer'
import { createStyles, getResolvedCardColors } from './styles'
import type { CardProps } from './types'

// MD3 elevation transitions follow the standard short4 duration.
const ELEVATION_TRANSITION = { type: 'timing', duration: 250 } as const

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

  const colors = useMemo(
    () => getResolvedCardColors(theme, variant, containerColor),
    [theme, variant, containerColor],
  )

  const layer = useStateLayer({
    colors: {
      rest: colors.backgroundColor,
      hovered: colors.hoveredBackgroundColor,
      focused: colors.focusedBackgroundColor,
      pressed: colors.pressedBackgroundColor,
    },
    isDisabled,
  })

  // MD3 elevation-on-hover cascade. Only `shadowOpacity` / `shadowRadius` /
  // `elevation` are animated — `shadowOffset` is nested and stays static at
  // the rest level (set by `styles.container`). The visible lift comes from
  // the radius + opacity growth, which is the bulk of the MD3 effect.
  const containerMotion = useMemo(() => {
    if (variant === 'outlined') return layer.container
    const rest =
      variant === 'elevated' ? theme.elevation.level1 : theme.elevation.level0
    const hover =
      variant === 'elevated' ? theme.elevation.level2 : theme.elevation.level1
    const animate = {
      ...layer.container.animate,
      shadowOpacity: rest.shadowOpacity,
      shadowRadius: rest.shadowRadius,
      elevation: rest.elevation,
    }
    const gesture = layer.container.gesture
      ? {
          ...layer.container.gesture,
          hovered: {
            ...layer.container.gesture.hovered,
            shadowOpacity: hover.shadowOpacity,
            shadowRadius: hover.shadowRadius,
            elevation: hover.elevation,
          },
        }
      : undefined
    const transition = {
      ...layer.container.transition,
      shadowOpacity: ELEVATION_TRANSITION,
      shadowRadius: ELEVATION_TRANSITION,
      elevation: ELEVATION_TRANSITION,
    }
    return { animate, gesture, transition }
  }, [layer.container, theme.elevation, variant])

  if (!isInteractive) {
    return (
      <View {...props} style={[styles.container, style]}>
        {children}
      </View>
    )
  }

  const userStyle = typeof style === 'function' ? undefined : style

  return (
    <View style={styles.wrapper}>
      <Motion.View
        pointerEvents="none"
        {...layer.focusRing}
        style={styles.focusRing}
      />
      <Motion.Pressable
        {...props}
        role="button"
        accessibilityState={{ disabled: isDisabled }}
        hitSlop={Platform.OS === 'web' ? undefined : 4}
        disabled={isDisabled}
        onPress={onPress}
        {...containerMotion}
        style={[
          styles.container,
          styles.interactiveContainer,
          isDisabled ? styles.disabledContainer : undefined,
          userStyle,
        ]}
      >
        {isDisabled ? (
          <View style={styles.disabledContent}>{children}</View>
        ) : (
          children
        )}
      </Motion.Pressable>
    </View>
  )
}
