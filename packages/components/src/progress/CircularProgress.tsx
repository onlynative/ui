import { useTheme } from '@onlynative/core'
import { useAnimation } from '@onlynative/inertia'
import { useMemo } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import {
  PROGRESS_CIRCULAR_SIZE,
  PROGRESS_CIRCULAR_STROKE,
  PROGRESS_TRACK_GAP,
  createCircularStyles,
  getProgressColors,
} from './styles'
import type { CircularProgressProps } from './types'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const INDETERMINATE_DURATION_MS = 1400
// Indeterminate arc occupies ~25% of the circumference — matches the MD3
// classic spinner cadence.
const INDETERMINATE_ARC_RATIO = 0.25

// `Easing.bezier(...)` returns an `EasingFunctionFactory`; `.factory()`
// unwraps it to the plain `(t: number) => number` Inertia expects.
const M3_STANDARD = Easing.bezier(0.2, 0, 0, 1).factory()
const M3_LINEAR = Easing.bezier(0, 0, 1, 1).factory()

// MD3 emphasized timing for determinate value transitions (short4 ~250 ms).
const MOTION_TRANSITION = {
  type: 'timing',
  duration: 250,
  easing: M3_STANDARD,
} as const

// Constant-speed indeterminate rotation, loops 0 → 1 forever; `alternate:
// false` so it snaps back to 0 at the end of each cycle (otherwise the
// rotation would reverse direction every other cycle, which reads as broken).
const ROTATION_TRANSITION = {
  type: 'timing',
  duration: INDETERMINATE_DURATION_MS,
  easing: M3_LINEAR,
  repeat: { count: 'infinite', alternate: false },
} as const

// When transitioning indeterminate → determinate the rotation snaps back to
// 0 (no animation) — otherwise the determinate arc would briefly continue
// rotating before settling.
const SNAP_TRANSITION = { type: 'no-animation' } as const

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max)

export function CircularProgress({
  progress,
  size = PROGRESS_CIRCULAR_SIZE,
  thickness = PROGRESS_CIRCULAR_STROKE,
  containerColor,
  trackColor,
  style,
  accessibilityLabel,
  ...rest
}: CircularProgressProps) {
  const theme = useTheme()
  const indeterminate = progress === undefined
  const value = indeterminate ? 0 : clamp(progress as number, 0, 1)

  const colors = useMemo(
    () => getProgressColors(theme, containerColor, trackColor),
    [theme, containerColor, trackColor],
  )
  const styles = useMemo(() => createCircularStyles(size), [size])

  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2
  // Convert a track gap measured in dp along the circumference into the
  // equivalent dasharray segment so the gap appears uniform regardless of
  // size / thickness.
  const gapLength = Math.min(PROGRESS_TRACK_GAP, circumference / 4)

  // Indeterminate rotation (0 → 1 mapped to 0 → 360°, looped). Same
  // indeterminate/determinate-handoff pattern as LinearProgress: when the
  // field becomes determinate, snap rotation back to 0 with `no-animation`
  // so the arc doesn't continue spinning past the determinate render.
  const rotation = useAnimation(
    indeterminate ? 1 : 0,
    indeterminate ? ROTATION_TRANSITION : SNAP_TRANSITION,
  )

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }],
  }))

  // Determinate progress, smoothly tweened to the latest prop. When
  // indeterminate the target is 0 — `progressShared` isn't read by the
  // indeterminate branch of the JSX, so animating it down is harmless.
  const progressShared = useAnimation(
    indeterminate ? 0 : value,
    MOTION_TRANSITION,
  )

  // SVG circles are rotated -90° so that the 0° start position is at 12
  // o'clock instead of 3 o'clock (default SVG behavior).
  const startRotation = `rotate(-90 ${center} ${center})`

  const trackAnimatedProps = useAnimatedProps(() => {
    if (indeterminate) {
      return { strokeDasharray: `${circumference} 0`, strokeDashoffset: 0 }
    }
    const v = progressShared.value
    if (v <= 0) {
      return { strokeDasharray: `${circumference} 0`, strokeDashoffset: 0 }
    }
    if (v >= 1) {
      return { strokeDasharray: `0 ${circumference}`, strokeDashoffset: 0 }
    }
    const activeLength = Math.max(0, v * circumference - gapLength)
    const trackVisible = Math.max(
      0,
      circumference - activeLength - gapLength * 2,
    )
    return {
      strokeDasharray: `${trackVisible} ${circumference - trackVisible}`,
      // Offset so the gap sits between active.end and track.start (advancing
      // by activeLength + gapLength puts the start of the visible track
      // segment one gap past the end of the active arc).
      strokeDashoffset: -(activeLength + gapLength),
    }
  }, [indeterminate, circumference, gapLength])

  const indicatorAnimatedProps = useAnimatedProps(() => {
    if (indeterminate) {
      const len = circumference * INDETERMINATE_ARC_RATIO
      return {
        strokeDasharray: `${len} ${Math.max(0, circumference - len)}`,
        strokeDashoffset: 0,
      }
    }
    const v = progressShared.value
    const activeLength = Math.max(0, v * circumference - gapLength)
    return {
      strokeDasharray: `${activeLength} ${Math.max(0, circumference - activeLength)}`,
      strokeDashoffset: 0,
    }
  }, [indeterminate, circumference, gapLength])

  const accessibilityValue = indeterminate
    ? undefined
    : { min: 0, max: 100, now: Math.round(value * 100) }

  const renderSvg = () => (
    <Svg width={size} height={size}>
      <AnimatedCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={colors.track}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
        transform={startRotation}
        animatedProps={trackAnimatedProps}
      />
      <AnimatedCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={colors.indicator}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
        transform={startRotation}
        animatedProps={indicatorAnimatedProps}
      />
    </Svg>
  )

  return (
    <View
      {...rest}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={accessibilityValue}
      style={[styles.root, style]}
    >
      {indeterminate ? (
        <Animated.View style={spinStyle}>{renderSvg()}</Animated.View>
      ) : (
        renderSvg()
      )}
    </View>
  )
}
