import { useIconResolver, useTheme } from '@onlynative/core'
import { useGesture, useSpring } from '@onlynative/inertia'
import { renderIcon, resolveColorFromStyle } from '@onlynative/utils'
import { useCallback, useMemo } from 'react'
import { Platform, Pressable, View } from 'react-native'
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'
import {
  SWITCH_STATE_LAYER_SIZE,
  SWITCH_THUMB_OFF_SIZE,
  SWITCH_THUMB_ON_SIZE,
  SWITCH_THUMB_PRESSED_SIZE,
  SWITCH_TRACK_BORDER_WIDTH,
  SWITCH_TRACK_PADDING,
  SWITCH_TRACK_WIDTH,
  createStyles,
  getResolvedColors,
} from './styles'
import type { SwitchProps } from './types'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const THUMB_TRANSLATE_X =
  SWITCH_TRACK_WIDTH - SWITCH_TRACK_PADDING * 2 - SWITCH_THUMB_ON_SIZE

// MD3 state-layer opacity tokens — drive the halo via `Math.max(...)`.
const HOVER_OPACITY = 0.08
const FOCUS_OPACITY = 0.1
const PRESS_OPACITY = 0.1

// MD3 emphasized spring for the toggle (slight overshoot, ~0.85 damping ratio).
// React-spring vocabulary: `tension` ≡ stiffness, `friction` ≡ damping.
const TOGGLE_SPRING = { tension: 380, friction: 33, mass: 1 } as const

// Per-layer state-layer transitions. Press uses a fast, predictable timing
// curve so the 28 dp thumb grow is reached in full within 120 ms.
const GESTURE_TRANSITIONS = {
  pressed: { type: 'timing', duration: 120 },
  hovered: { type: 'timing', duration: 150 },
  focusVisible: { type: 'timing', duration: 200 },
} as const

const ICON_SIZE = 16

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
  const hasUnselectedIcon = Boolean(unselectedIcon)
  const offThumbSize = hasUnselectedIcon
    ? SWITCH_THUMB_ON_SIZE
    : SWITCH_THUMB_OFF_SIZE

  const theme = useTheme()
  const iconResolver = useIconResolver()
  const styles = useMemo(() => createStyles(theme), [theme])

  const offColors = useMemo(
    () => getResolvedColors(theme, false, containerColor, contentColor),
    [theme, containerColor, contentColor],
  )
  const onColors = useMemo(
    () => getResolvedColors(theme, true, containerColor, contentColor),
    [theme, containerColor, contentColor],
  )

  // MD3: disabled visuals differ between selected and unselected — the
  // selected-disabled thumb is `surface` (no opacity ramp) and the track has
  // no outline, while the unselected-disabled thumb is `onSurface@38%` with a
  // 12% outline. Pick the right palette here rather than baking the
  // unselected-only set into the stylesheet.
  const disabledPalette = isSelected ? onColors : offColors
  const disabledTrackOverride = useMemo(
    () => ({
      backgroundColor: disabledPalette.disabledTrackColor,
      borderColor: disabledPalette.disabledBorderColor,
    }),
    [disabledPalette.disabledTrackColor, disabledPalette.disabledBorderColor],
  )
  const disabledThumbOverride = useMemo(
    () => ({ backgroundColor: disabledPalette.disabledThumbColor }),
    [disabledPalette.disabledThumbColor],
  )

  const progress = useSpring(isSelected ? 1 : 0, TOGGLE_SPRING)
  // `focusVisible` mirrors the prior manual `isFocusVisible()` gate — it only
  // raises on keyboard focus, so it maps to the old `focused` SV.
  const {
    pressed,
    hovered,
    focusVisible: focused,
    handlers,
  } = useGesture(GESTURE_TRANSITIONS)

  const animatedTrackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [offColors.trackColor, onColors.trackColor],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [offColors.borderColor, onColors.borderColor],
    ),
  }))

  const animatedThumbStyle = useAnimatedStyle(() => {
    const baseSize = interpolate(
      progress.value,
      [0, 1],
      [offThumbSize, SWITCH_THUMB_ON_SIZE],
    )
    const size = interpolate(
      pressed.value,
      [0, 1],
      [baseSize, SWITCH_THUMB_PRESSED_SIZE],
    )
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [offColors.thumbColor, onColors.thumbColor],
      ),
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, THUMB_TRANSLATE_X],
          ),
        },
      ],
    }
  })

  // Halo center should track the thumb's center. Static `left` is calibrated
  // for the off position; `translateX` adds (a) the toggle progress shift and
  // (b) any thumb-grow shift on press (since the thumb's left edge is fixed,
  // its center moves right by half the size delta).
  const haloLeft =
    SWITCH_TRACK_PADDING -
    SWITCH_TRACK_BORDER_WIDTH +
    offThumbSize / 2 -
    SWITCH_STATE_LAYER_SIZE / 2

  const animatedHaloStyle = useAnimatedStyle(() => {
    const baseSize = interpolate(
      progress.value,
      [0, 1],
      [offThumbSize, SWITCH_THUMB_ON_SIZE],
    )
    const size = interpolate(
      pressed.value,
      [0, 1],
      [baseSize, SWITCH_THUMB_PRESSED_SIZE],
    )
    return {
      opacity: Math.max(
        hovered.value * HOVER_OPACITY,
        focused.value * FOCUS_OPACITY,
        pressed.value * PRESS_OPACITY,
      ),
      // MD3 spec halo colour: `onSurface` (unselected) ↔ `primary` (selected).
      // Independent of any `contentColor` override, which targets the thumb.
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [theme.colors.onSurface, theme.colors.primary],
      ),
      transform: [
        {
          translateX:
            progress.value * THUMB_TRANSLATE_X + (size - offThumbSize) / 2,
        },
      ],
    }
  })

  const animatedFocusRingStyle = useAnimatedStyle(() => ({
    opacity: focused.value,
  }))

  const animatedSelectedIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }))
  const animatedUnselectedIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }))

  const disabledIconColor = useMemo(
    () => resolveColorFromStyle(styles.disabledIconColor),
    [styles.disabledIconColor],
  )
  const selectedIconColor = isDisabled ? disabledIconColor : onColors.iconColor
  const unselectedIconColor = isDisabled
    ? disabledIconColor
    : offColors.iconColor

  const handlePress = useCallback(() => {
    if (!isDisabled) {
      onValueChange?.(!isSelected)
    }
  }, [isDisabled, isSelected, onValueChange])

  return (
    <View style={styles.wrapper}>
      <Animated.View
        pointerEvents="none"
        style={[styles.focusRing, animatedFocusRingStyle]}
      />
      <AnimatedPressable
        {...props}
        accessibilityRole="switch"
        accessibilityState={{
          disabled: isDisabled,
          checked: isSelected,
        }}
        hitSlop={Platform.OS === 'web' ? undefined : 4}
        disabled={isDisabled}
        onPress={handlePress}
        {...handlers}
        style={[
          styles.track,
          animatedTrackStyle,
          isDisabled ? styles.disabledTrack : undefined,
          isDisabled ? disabledTrackOverride : undefined,
          style,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.stateLayer, { left: haloLeft }, animatedHaloStyle]}
        />
        <Animated.View
          style={[
            styles.thumbBase,
            animatedThumbStyle,
            isDisabled ? disabledThumbOverride : undefined,
          ]}
        >
          {selectedIcon ? (
            <Animated.View
              pointerEvents="none"
              style={[styles.iconLayer, animatedSelectedIconStyle]}
            >
              {renderIcon(
                selectedIcon,
                { size: ICON_SIZE, color: selectedIconColor },
                iconResolver,
              )}
            </Animated.View>
          ) : null}
          {unselectedIcon ? (
            <Animated.View
              pointerEvents="none"
              style={[styles.iconLayer, animatedUnselectedIconStyle]}
            >
              {renderIcon(
                unselectedIcon,
                { size: ICON_SIZE, color: unselectedIconColor },
                iconResolver,
              )}
            </Animated.View>
          ) : null}
        </Animated.View>
      </AnimatedPressable>
    </View>
  )
}
