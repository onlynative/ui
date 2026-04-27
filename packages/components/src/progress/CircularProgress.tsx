import { useTheme } from '@onlynative/core'
import { useEffect, useMemo, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import {
  PROGRESS_CIRCULAR_SIZE,
  PROGRESS_CIRCULAR_STROKE,
  PROGRESS_TRACK_GAP,
  createCircularStyles,
  getProgressColors,
} from './styles'
import type { CircularProgressProps } from './types'

const AnimatedView = Animated.View
// react-native-svg < 15 didn't accept Animated values on transform; we animate
// the wrapping View instead so the indeterminate spinner is fully native-driven.

const INDETERMINATE_DURATION_MS = 1400
// Indeterminate arc occupies ~25% of the circumference — matches the MD3
// classic spinner cadence without needing JS-driven dasharray animation.
const INDETERMINATE_ARC_RATIO = 0.25

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

  const rotation = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (!indeterminate) {
      rotation.stopAnimation()
      return
    }
    rotation.setValue(0)
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: INDETERMINATE_DURATION_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )
    loop.start()
    return () => loop.stop()
  }, [indeterminate, rotation])

  const spinStyle = useMemo(
    () => ({
      transform: [
        {
          rotate: rotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          }),
        },
      ],
    }),
    [rotation],
  )

  // SVG circles are rotated -90° so that the 0° start position is at 12
  // o'clock instead of 3 o'clock (default SVG behavior).
  const startRotation = `rotate(-90 ${center} ${center})`

  // Convert a track gap measured in dp along the circumference into the
  // equivalent dasharray segment so the gap appears uniform regardless of
  // size / thickness.
  const gapLength = Math.min(PROGRESS_TRACK_GAP, circumference / 4)

  let activeLength: number
  let trackDasharray: string
  let trackDashoffset: number

  if (indeterminate) {
    activeLength = circumference * INDETERMINATE_ARC_RATIO
    trackDasharray = `${circumference} 0`
    trackDashoffset = 0
  } else {
    activeLength = Math.max(0, value * circumference - gapLength)
    // Inactive track fills the complement, leaving gap on each side of the
    // active arc when both segments are visible.
    if (value <= 0) {
      trackDasharray = `${circumference} 0`
      trackDashoffset = 0
    } else if (value >= 1) {
      trackDasharray = `0 ${circumference}`
      trackDashoffset = 0
    } else {
      const trackVisible = Math.max(
        0,
        circumference - activeLength - gapLength * 2,
      )
      trackDasharray = `${trackVisible} ${circumference - trackVisible}`
      // Offset so the gap sits between active.end and track.start (advancing
      // by activeLength + gapLength puts the start of the visible track
      // segment one gap past the end of the active arc).
      trackDashoffset = -(activeLength + gapLength)
    }
  }

  const activeDasharray = `${activeLength} ${Math.max(0, circumference - activeLength)}`
  const accessibilityValue = indeterminate
    ? undefined
    : { min: 0, max: 100, now: Math.round(value * 100) }

  const renderSvg = () => (
    <Svg width={size} height={size}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={colors.track}
        strokeWidth={thickness}
        fill="none"
        strokeDasharray={trackDasharray}
        strokeDashoffset={trackDashoffset}
        strokeLinecap="round"
        transform={startRotation}
      />
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={colors.indicator}
        strokeWidth={thickness}
        fill="none"
        strokeDasharray={activeDasharray}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform={startRotation}
      />
    </Svg>
  )

  return (
    <View
      {...rest}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={accessibilityValue}
      style={[styles.root, style]}
    >
      {indeterminate ? (
        <AnimatedView style={spinStyle}>{renderSvg()}</AnimatedView>
      ) : (
        renderSvg()
      )}
    </View>
  )
}
