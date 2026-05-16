import { useTheme } from '@onlynative/core'
import { useGesture, useSpring } from '@onlynative/inertia'
import { useCallback, useMemo } from 'react'
import { Platform, Pressable } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { createStyles, getResolvedRadioColors } from './styles'
import type { RadioProps } from './types'

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
  const styles = useMemo(() => createStyles(theme), [theme])

  const offColors = useMemo(
    () => getResolvedRadioColors(theme, false, containerColor, contentColor),
    [theme, containerColor, contentColor],
  )
  const onColors = useMemo(
    () => getResolvedRadioColors(theme, true, containerColor, contentColor),
    [theme, containerColor, contentColor],
  )

  const progress = useSpring(isSelected ? 1 : 0, TOGGLE_SPRING)
  // `focusVisible` mirrors the prior manual `isFocusVisible()` gate — it only
  // raises on keyboard focus, so it maps to the old `focused` SV.
  const {
    hovered,
    focusVisible: focused,
    pressed,
    handlers,
  } = useGesture(GESTURE_TRANSITIONS)

  const animatedOuterStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [offColors.borderColor, onColors.borderColor],
    ),
  }))

  const animatedInnerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progress.value }],
    backgroundColor: onColors.dotColor,
  }))

  const animatedStateLayerStyle = useAnimatedStyle(() => {
    // Solid base color, view opacity carries the alpha — produces exactly the
    // MD3 token values (8/10/10 %) without any compounding.
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
    if (!isDisabled) onValueChange?.(!isSelected)
  }, [isDisabled, isSelected, onValueChange])

  // Disabled snaps to disabled colors (no animation when disabled).
  const outerOverride = isDisabled
    ? { borderColor: offColors.disabledBorderColor }
    : undefined

  return (
    <AnimatedPressable
      {...props}
      accessibilityRole="radio"
      accessibilityState={{
        disabled: isDisabled,
        checked: isSelected,
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
      <Animated.View style={[styles.outer, animatedOuterStyle, outerOverride]}>
        <Animated.View
          style={[
            styles.inner,
            animatedInnerStyle,
            isDisabled
              ? { backgroundColor: onColors.disabledDotColor }
              : undefined,
          ]}
        />
      </Animated.View>
    </AnimatedPressable>
  )
}
