import { useIconResolver, useTheme } from '@onlynative/core'
import { useGesture, useSpring } from '@onlynative/inertia'
import { renderIcon } from '@onlynative/utils'
import { useCallback, useMemo } from 'react'
import { Platform, Pressable } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'
import {
  CHECKBOX_ICON_SIZE,
  createStyles,
  getResolvedCheckboxColors,
} from './styles'
import type { CheckboxProps } from './types'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// MD3 state-layer opacity tokens — drive the halo via `Math.max(...)`.
const HOVER_OPACITY = 0.08
const FOCUS_OPACITY = 0.1
const PRESS_OPACITY = 0.1

// React-spring vocabulary: `tension` ≡ stiffness, `friction` ≡ damping.
const TOGGLE_SPRING = { tension: 380, friction: 26, mass: 1 } as const

const GESTURE_TRANSITIONS = {
  pressed: { type: 'timing', duration: 100 },
  hovered: { type: 'timing', duration: 150 },
  focusVisible: { type: 'timing', duration: 200 },
} as const

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
  const styles = useMemo(() => createStyles(theme), [theme])

  const offColors = useMemo(
    () => getResolvedCheckboxColors(theme, false, containerColor, contentColor),
    [theme, containerColor, contentColor],
  )
  const onColors = useMemo(
    () => getResolvedCheckboxColors(theme, true, containerColor, contentColor),
    [theme, containerColor, contentColor],
  )

  const progress = useSpring(isChecked ? 1 : 0, TOGGLE_SPRING)
  // `focusVisible` mirrors the prior manual `isFocusVisible()` gate — it only
  // raises on keyboard focus, so it maps to the old `focused` SV.
  const {
    hovered,
    focusVisible: focused,
    pressed,
    handlers,
  } = useGesture(GESTURE_TRANSITIONS)

  const animatedBoxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [offColors.backgroundColor, onColors.backgroundColor],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [offColors.borderColor, onColors.borderColor],
    ),
  }))

  const animatedIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }))

  const animatedStateLayerStyle = useAnimatedStyle(() => {
    // Solid base color, view opacity carries the alpha. Picking the strongest
    // active interaction's intensity keeps the spec values intact (8/10/10 %).
    const layerColor = interpolateColor(
      progress.value,
      [0, 1],
      [offColors.stateLayerColor, onColors.stateLayerColor],
    )
    return {
      opacity: Math.max(
        hovered.value * HOVER_OPACITY,
        focused.value * FOCUS_OPACITY,
        pressed.value * PRESS_OPACITY,
      ),
      backgroundColor: layerColor,
    }
  })

  const animatedFocusRingStyle = useAnimatedStyle(() => ({
    opacity: focused.value,
  }))

  const handlePress = useCallback(() => {
    if (!isDisabled) onValueChange?.(!isChecked)
  }, [isDisabled, isChecked, onValueChange])

  const iconColor = isDisabled
    ? isChecked
      ? onColors.disabledIconColor
      : offColors.disabledIconColor
    : isChecked
      ? onColors.iconColor
      : offColors.iconColor

  const boxOverride = isDisabled
    ? {
        backgroundColor: isChecked
          ? onColors.disabledBackgroundColor
          : offColors.disabledBackgroundColor,
        borderColor: isChecked
          ? onColors.disabledBorderColor
          : offColors.disabledBorderColor,
      }
    : undefined

  return (
    <AnimatedPressable
      {...props}
      accessibilityRole="checkbox"
      accessibilityState={{
        disabled: isDisabled,
        checked: isChecked,
      }}
      hitSlop={Platform.OS === 'web' ? undefined : 4}
      disabled={isDisabled}
      onPress={handlePress}
      {...handlers}
      style={[
        styles.container,
        isDisabled ? styles.disabledContainer : undefined,
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.focusRing, animatedFocusRingStyle]}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.stateLayer, animatedStateLayerStyle]}
      />
      <Animated.View
        testID="checkbox-box"
        style={[styles.box, animatedBoxStyle, boxOverride]}
      >
        {isChecked ? (
          <Animated.View pointerEvents="none" style={animatedIconStyle}>
            {renderIcon(
              checkIcon,
              { size: CHECKBOX_ICON_SIZE, color: iconColor },
              iconResolver,
            )}
          </Animated.View>
        ) : null}
      </Animated.View>
    </AnimatedPressable>
  )
}
