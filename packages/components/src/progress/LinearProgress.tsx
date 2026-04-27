import { useTheme } from '@onlynative/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { Animated, Easing, View } from 'react-native'
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

  const animValue = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (!indeterminate) {
      animValue.stopAnimation()
      return
    }
    animValue.setValue(0)
    const loop = Animated.loop(
      Animated.timing(animValue, {
        toValue: 1,
        duration: INDETERMINATE_DURATION_MS,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    )
    loop.start()
    return () => loop.stop()
  }, [indeterminate, animValue])

  const segmentWidth = Math.max(width * INDETERMINATE_SEGMENT_RATIO, 0)

  const indeterminateIndicatorStyle = useMemo(
    () => [
      styles.activeIndicator,
      {
        left: 0,
        width: segmentWidth,
        transform: [
          {
            translateX: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-segmentWidth, width],
            }),
          },
        ],
      },
    ],
    [styles.activeIndicator, segmentWidth, width, animValue],
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
  const midGap =
    !indeterminate && value > 0 && value < 1 ? PROGRESS_TRACK_GAP : 0
  const progressArea = Math.max(0, width - trailingReserved)
  const activeWidth = Math.max(0, value * (progressArea - midGap))
  const inactiveLeft = activeWidth + midGap
  const inactiveWidth = Math.max(0, progressArea - activeWidth - midGap)

  const activeStyle = useMemo(
    () => [styles.activeIndicator, { left: 0, width: activeWidth }],
    [styles.activeIndicator, activeWidth],
  )
  const inactiveStyle = useMemo(
    () => [styles.inactiveTrack, { left: inactiveLeft, width: inactiveWidth }],
    [styles.inactiveTrack, inactiveLeft, inactiveWidth],
  )
  const stopStyle = useMemo(
    () => [
      styles.stopDot,
      { right: 0, top: thickness / 2 - PROGRESS_STOP_INDICATOR / 2 },
    ],
    [styles.stopDot, thickness],
  )

  return (
    <View
      {...rest}
      onLayout={onLayout}
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
          <Animated.View style={indeterminateIndicatorStyle} />
        </>
      ) : (
        <>
          {activeWidth > 0 ? <View style={activeStyle} /> : null}
          {inactiveWidth > 0 ? <View style={inactiveStyle} /> : null}
          {showStop ? <View style={stopStyle} /> : null}
        </>
      )}
    </View>
  )
}
