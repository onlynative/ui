import { useTheme } from '@onlynative/core'
import { useAnimation } from '@onlynative/inertia'
import { useMemo, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { I18nManager, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle } from 'react-native-reanimated'
import {
  PROGRESS_STOP_INDICATOR,
  PROGRESS_TRACK_GAP,
  PROGRESS_TRACK_HEIGHT,
  createLinearStyles,
} from './styles'
import type { LinearProgressProps } from './types'

// Indeterminate segment is 40% of the track width and slides across once per
// loop iteration. Matches the visual cadence of the MD3 single-segment variant.
const INDETERMINATE_SEGMENT_RATIO = 0.4
const INDETERMINATE_DURATION_MS = 1800

// `Easing.bezier(...)` returns an `EasingFunctionFactory`; `.factory()`
// unwraps it to the plain `(t: number) => number` Inertia expects.
const M3_STANDARD = Easing.bezier(0.2, 0, 0, 1).factory()
const M3_IN_OUT_CUBIC = Easing.bezier(0.42, 0, 0.58, 1).factory()

// MD3 emphasized timing for determinate value transitions (short4 ~250 ms).
const MOTION_TRANSITION = {
  type: 'timing',
  duration: 250,
  easing: M3_STANDARD,
} as const

// Indeterminate slide loops 0 → 1 forever; `alternate: false` so it snaps
// back to 0 at the end of each cycle rather than sliding back across.
const INDETERMINATE_TRANSITION = {
  type: 'timing',
  duration: INDETERMINATE_DURATION_MS,
  easing: M3_IN_OUT_CUBIC,
  repeat: { count: 'infinite', alternate: false },
} as const

// When transitioning from indeterminate → determinate the slide value snaps
// back to 0 with no animation (the loop is gone; we don't want it to slowly
// drift toward 0 mid-cycle).
const SNAP_TRANSITION = { type: 'no-animation' } as const

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max)

export function LinearProgress({
  progress,
  containerColor,
  trackColor,
  stopIndicator = true,
  thickness = PROGRESS_TRACK_HEIGHT,
  style,
  accessibilityLabel,
  ...rest
}: LinearProgressProps) {
  const theme = useTheme()
  const indeterminate = progress === undefined
  const value = indeterminate ? 0 : clamp(progress as number, 0, 1)

  const styles = useMemo(
    () => createLinearStyles(theme, thickness, containerColor, trackColor),
    [theme, thickness, containerColor, trackColor],
  )

  const [width, setWidth] = useState(0)
  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    setWidth((prev) => (prev === w ? prev : w))
  }

  // Indeterminate slide (0 → 1, looped). When `indeterminate` flips off, we
  // re-run with target 0 + `no-animation` so the slider snaps home instead of
  // continuing a partial cycle.
  const slide = useAnimation(
    indeterminate ? 1 : 0,
    indeterminate ? INDETERMINATE_TRANSITION : SNAP_TRANSITION,
  )

  // Determinate value, smoothly tweened to the latest prop. When the field is
  // indeterminate the target is 0 (matching the original behaviour where the
  // determinate SV was effectively unused) and isn't visible anyway — the
  // indeterminate branch of the JSX never reads `progressShared`.
  const progressShared = useAnimation(
    indeterminate ? 0 : value,
    MOTION_TRANSITION,
  )

  const segmentWidth = Math.max(width * INDETERMINATE_SEGMENT_RATIO, 0)

  // RTL: position the segment with `start: 0` so it anchors at the leading
  // edge of the bar in both directions; then flip the `translateX` sign so
  // the segment slides from the leading edge toward the trailing edge in
  // RTL too (physical `translateX` is direction-agnostic in RN).
  const rtlSlideMultiplier = I18nManager.isRTL ? -1 : 1
  const indeterminateStyle = useAnimatedStyle(
    () => ({
      start: 0,
      width: segmentWidth,
      transform: [
        {
          translateX:
            rtlSlideMultiplier *
            (-segmentWidth + slide.value * (width + segmentWidth)),
        },
      ],
    }),
    [segmentWidth, width, rtlSlideMultiplier],
  )

  // Determinate layout. The bar is split into:
  //   [active] [gap] [inactive] [gap] [stop dot]
  // The trailing stop dot + its gap are reserved only when the dot is shown
  // (i.e. determinate mode, value < 1). The mid gap exists only when both the
  // active and inactive segments are visible (0 < value < 1).
  const showStop = !indeterminate && stopIndicator && value < 1
  const trailingReserved = showStop
    ? PROGRESS_STOP_INDICATOR + PROGRESS_TRACK_GAP
    : 0
  const progressArea = Math.max(0, width - trailingReserved)

  const activeStyle = useAnimatedStyle(() => {
    const v = progressShared.value
    const midGap = v > 0 && v < 1 ? PROGRESS_TRACK_GAP : 0
    const w = Math.max(0, v * (progressArea - midGap))
    return { start: 0, width: w }
  }, [progressArea])

  const inactiveStyle = useAnimatedStyle(() => {
    const v = progressShared.value
    const midGap = v > 0 && v < 1 ? PROGRESS_TRACK_GAP : 0
    const aw = Math.max(0, v * (progressArea - midGap))
    const start = aw + midGap
    const w = Math.max(0, progressArea - aw - midGap)
    return { start, width: w }
  }, [progressArea])

  const stopStyle = useMemo(
    () => [
      styles.stopDot,
      { end: 0, top: thickness / 2 - PROGRESS_STOP_INDICATOR / 2 },
    ],
    [styles.stopDot, thickness],
  )

  return (
    <View
      {...rest}
      onLayout={onLayout}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={
        indeterminate
          ? undefined
          : { min: 0, max: 100, now: Math.round(value * 100) }
      }
      style={[styles.root, style]}
    >
      {indeterminate ? (
        <>
          <View style={styles.inactiveTrackFull} />
          <Animated.View style={[styles.activeIndicator, indeterminateStyle]} />
        </>
      ) : (
        <>
          <Animated.View style={[styles.activeIndicator, activeStyle]} />
          <Animated.View style={[styles.inactiveTrack, inactiveStyle]} />
          {showStop ? <View style={stopStyle} /> : null}
        </>
      )}
    </View>
  )
}
