import { useIconResolver, useTheme } from '@onlynative/core'
import { isFocusVisible, renderIcon } from '@onlynative/utils'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  AccessibilityActionEvent,
  GestureResponderEvent,
  LayoutChangeEvent,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { I18nManager, PanResponder, Pressable, Text, View } from 'react-native'
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import {
  SLIDER_FOCUS_RING_SIZE,
  SLIDER_STATE_LAYER_SIZE,
  SLIDER_STOP_INDICATOR,
  SLIDER_THUMB_GAP,
  SLIDER_THUMB_WIDTH,
  SLIDER_THUMB_WIDTH_PRESSED,
  SLIDER_TICK_SIZE,
  SLIDER_TRACK_CORNER_INNER,
  SLIDER_TRACK_CORNER_OUTER,
  createStyles,
} from './styles'
import type { SliderProps, SliderValue } from './types'

type ThumbId = 'low' | 'high'

const ICON_SIZE = 18
const REST_HALF = SLIDER_THUMB_WIDTH / 2
const PRESSED_HALF = SLIDER_THUMB_WIDTH_PRESSED / 2
// Per-edge shift between rest and fully pressed thumb. Positive means the edge
// moves to the right on press (e.g. the right side of a thumb's gap zone).
const PRESS_DELTA = PRESSED_HALF - REST_HALF

// MD3 expressive motion tokens.
//   - Size/translate transitions ride an emphasized spring (slight overshoot,
//     ~0.85 damping ratio) — matches the same TOGGLE_SPRING used by Switch.
//   - Opacity transitions use a short4 (200 ms) duration with the emphasized
//     cubic-bezier easing per the M3 motion spec.
const PRESS_SPRING = { damping: 33, stiffness: 380, mass: 1 }
const LABEL_TIMING = {
  duration: 200,
  easing: Easing.bezier(0.2, 0, 0, 1),
}
// MD3 state-layer opacities for the tonal halo per interaction state.
const HOVER_OPACITY = 0.08
const FOCUS_OPACITY = 0.1
const PRESS_OPACITY = 0.1
const STATE_LAYER_TIMING = {
  duration: 150,
  easing: Easing.bezier(0.2, 0, 0, 1),
}
const FOCUS_RING_TIMING = {
  duration: 200,
  easing: Easing.bezier(0.2, 0, 0, 1),
}
// How far the value label pops up while it fades in (in dp).
const LABEL_POP = 8

const ACCESSIBILITY_ACTIONS = [
  { name: 'increment' as const },
  { name: 'decrement' as const },
]

// One end of a track segment expressed as a rest-time position plus a press
// shift. Geometry is computed JS-side using REST thumb widths; the worklet
// interpolates toward the pressed position by reading the relevant thumb's
// shared press progress (0 → 1).
//
// `bound` is an optional secondary atom combined with the primary via min/max.
// This is needed in the centered-slider 3-segment paths where the segment edge
// closest to the centered midpoint must clamp to whichever is *closer* to the
// thumb — the fixed center marker (centerPos ± 1) at rest, or the thumb's gap
// zone once pressed (which can extend past the marker on press).
interface EdgeAtom {
  rest: number
  shift: number
  thumbId: ThumbId | null
}
interface EdgeData extends EdgeAtom {
  bound?: { kind: 'min' | 'max' } & EdgeAtom
}

interface Segment {
  kind: 'active' | 'inactive'
  start: EdgeData
  end: EdgeData
  cornerLeft: number
  cornerRight: number
  // For inactive segments, where to put the stop indicator: a fixed offset
  // measured from either the leading edge (`fromStart: true`) or trailing edge.
  stopAt: { fromStart: boolean; offset: number } | null
}

const fixedEdge = (rest: number): EdgeData => ({
  rest,
  shift: 0,
  thumbId: null,
})

const leftThumbEdge = (thumbPos: number, thumbId: ThumbId): EdgeData => ({
  rest: thumbPos - REST_HALF - SLIDER_THUMB_GAP,
  shift: -PRESS_DELTA,
  thumbId,
})

const rightThumbEdge = (thumbPos: number, thumbId: ThumbId): EdgeData => ({
  rest: thumbPos + REST_HALF + SLIDER_THUMB_GAP,
  shift: PRESS_DELTA,
  thumbId,
})

const withMin = (edge: EdgeData, bound: EdgeAtom): EdgeData => ({
  ...edge,
  bound: { kind: 'min', ...bound },
})

const withMax = (edge: EdgeData, bound: EdgeAtom): EdgeData => ({
  ...edge,
  bound: { kind: 'max', ...bound },
})

const STOP_OFFSET = SLIDER_STOP_INDICATOR / 2 + 2

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max)

const snapToStep = (v: number, step: number, min: number) => {
  if (!step || step <= 0) return v
  return Math.round((v - min) / step) * step + min
}

const defaultFormat = (v: number, step: number) => {
  if (!step || step <= 0) return String(Math.round(v * 100) / 100)
  if (step >= 1) return String(Math.round(v))
  const decimals = Math.max(0, Math.ceil(-Math.log10(step)))
  return v.toFixed(decimals)
}

interface SegmentSlotProps {
  segment: Segment
  lowPressed: SharedValue<number>
  highPressed: SharedValue<number>
  baseStyle: ViewStyle
  kindStyle: ViewStyle
  disabledStyle: ViewStyle | undefined
}

function SegmentSlot({
  segment,
  lowPressed,
  highPressed,
  baseStyle,
  kindStyle,
  disabledStyle,
}: SegmentSlotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const evalEdge = (edge: EdgeData) => {
      'worklet'
      const press =
        edge.thumbId === 'low'
          ? lowPressed.value
          : edge.thumbId === 'high'
            ? highPressed.value
            : 0
      let v = edge.rest + edge.shift * press
      if (edge.bound) {
        const bp =
          edge.bound.thumbId === 'low'
            ? lowPressed.value
            : edge.bound.thumbId === 'high'
              ? highPressed.value
              : 0
        const bv = edge.bound.rest + edge.bound.shift * bp
        v = edge.bound.kind === 'min' ? Math.min(v, bv) : Math.max(v, bv)
      }
      return v
    }
    const start = evalEdge(segment.start)
    const end = evalEdge(segment.end)
    const w = Math.max(0, end - start)
    return {
      left: start,
      width: w,
      borderTopLeftRadius: segment.cornerLeft,
      borderBottomLeftRadius: segment.cornerLeft,
      borderTopRightRadius: segment.cornerRight,
      borderBottomRightRadius: segment.cornerRight,
    }
  }, [segment])

  return (
    <Animated.View
      pointerEvents="none"
      style={[baseStyle, kindStyle, disabledStyle, animatedStyle]}
    />
  )
}

interface StopIndicatorSlotProps {
  segment: Segment
  lowPressed: SharedValue<number>
  highPressed: SharedValue<number>
  baseStyle: ViewStyle
  kindStyle: ViewStyle
  disabledStyle: ViewStyle | undefined
}

function StopIndicatorSlot({
  segment,
  lowPressed,
  highPressed,
  baseStyle,
  kindStyle,
  disabledStyle,
}: StopIndicatorSlotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const evalEdge = (edge: EdgeData) => {
      'worklet'
      const press =
        edge.thumbId === 'low'
          ? lowPressed.value
          : edge.thumbId === 'high'
            ? highPressed.value
            : 0
      let v = edge.rest + edge.shift * press
      if (edge.bound) {
        const bp =
          edge.bound.thumbId === 'low'
            ? lowPressed.value
            : edge.bound.thumbId === 'high'
              ? highPressed.value
              : 0
        const bv = edge.bound.rest + edge.bound.shift * bp
        v = edge.bound.kind === 'min' ? Math.min(v, bv) : Math.max(v, bv)
      }
      return v
    }
    const stop = segment.stopAt
    if (!stop) return { opacity: 0 }
    const center = stop.fromStart
      ? evalEdge(segment.start) + stop.offset
      : evalEdge(segment.end) - stop.offset
    return {
      left: center - SLIDER_STOP_INDICATOR / 2,
      opacity: 1,
    }
  }, [segment])

  return (
    <Animated.View
      pointerEvents="none"
      style={[baseStyle, kindStyle, disabledStyle, animatedStyle]}
    />
  )
}

interface ThumbSlotProps {
  thumbId: ThumbId
  centerX: number
  pressed: SharedValue<number>
  baseStyle: ViewStyle
  disabledStyle: ViewStyle | undefined
}

function ThumbSlot({
  centerX,
  pressed,
  baseStyle,
  disabledStyle,
}: ThumbSlotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const w =
      SLIDER_THUMB_WIDTH +
      (SLIDER_THUMB_WIDTH_PRESSED - SLIDER_THUMB_WIDTH) * pressed.value
    return {
      left: centerX - w / 2,
      width: w,
      borderRadius: w / 2,
    }
  }, [centerX])

  return (
    <Animated.View
      pointerEvents="none"
      style={[baseStyle, disabledStyle, animatedStyle]}
    />
  )
}

interface ValueLabelSlotProps {
  centerX: number
  labelWidth: number
  opacity: SharedValue<number>
  onLayout: (e: LayoutChangeEvent) => void
  baseStyle: ViewStyle
  textStyle: TextStyle
  text: string
}

function ValueLabelSlot({
  centerX,
  labelWidth,
  opacity,
  onLayout,
  baseStyle,
  textStyle,
  text,
}: ValueLabelSlotProps) {
  // Measurement pass needs opacity 0 (so the label can size itself before we
  // know how to center it). Once we have a non-zero width, follow the
  // animated opacity and pop the label up by LABEL_POP dp as it fades in,
  // per MD3's emphasized-decelerate enter motion.
  const animatedStyle = useAnimatedStyle(() => {
    const o = labelWidth > 0 ? opacity.value : 0
    return {
      opacity: o,
      transform: [{ translateY: (1 - o) * LABEL_POP }],
    }
  })

  return (
    <Animated.View
      pointerEvents="none"
      onLayout={onLayout}
      style={[baseStyle, { left: centerX - labelWidth / 2 }, animatedStyle]}
    >
      <Text style={textStyle} numberOfLines={1}>
        {text}
      </Text>
    </Animated.View>
  )
}

interface StateLayerSlotProps {
  centerX: number
  hovered: SharedValue<number>
  focused: SharedValue<number>
  pressed: SharedValue<number>
  baseStyle: ViewStyle
}

// MD3 tonal halo around the thumb. Combines hover (8 %), focus (10 %), and
// press (10 %) state-layer opacities and follows the same press progress as
// the thumb's 4 → 16 dp grow.
function StateLayerSlot({
  centerX,
  hovered,
  focused,
  pressed,
  baseStyle,
}: StateLayerSlotProps) {
  const animatedStyle = useAnimatedStyle(
    () => ({
      left: centerX - SLIDER_STATE_LAYER_SIZE / 2,
      opacity: Math.max(
        Math.max(0, Math.min(1, hovered.value)) * HOVER_OPACITY,
        Math.max(0, Math.min(1, focused.value)) * FOCUS_OPACITY,
        Math.max(0, Math.min(1, pressed.value)) * PRESS_OPACITY,
      ),
    }),
    [centerX],
  )
  return (
    <Animated.View pointerEvents="none" style={[baseStyle, animatedStyle]} />
  )
}

interface FocusRingSlotProps {
  centerX: number
  focused: SharedValue<number>
  baseStyle: ViewStyle
}

// MD3 keyboard-focus ring around the focused thumb. Only shows when focus is
// keyboard-induced (the parent Pressable gates `focused` via isFocusVisible()).
function FocusRingSlot({ centerX, focused, baseStyle }: FocusRingSlotProps) {
  const animatedStyle = useAnimatedStyle(
    () => ({
      left: centerX - SLIDER_FOCUS_RING_SIZE / 2,
      opacity: focused.value,
    }),
    [centerX],
  )
  return (
    <Animated.View pointerEvents="none" style={[baseStyle, animatedStyle]} />
  )
}

interface TickSlotProps {
  cx: number
  lowPos: number
  highPos: number
  hasHigh: boolean
  lowPressed: SharedValue<number>
  highPressed: SharedValue<number>
  baseStyle: ViewStyle
  disabledStyle: ViewStyle | undefined
}

// Ticks fade out as the (animated) thumb gap zone passes over them, instead of
// snap-hiding. The 2 dp soft-edge band keeps the transition smooth without
// drawing attention to itself.
function TickSlot({
  cx,
  lowPos,
  highPos,
  hasHigh,
  lowPressed,
  highPressed,
  baseStyle,
  disabledStyle,
}: TickSlotProps) {
  const lowDist = Math.abs(cx - lowPos)
  const highDist = Math.abs(cx - highPos)
  const animatedStyle = useAnimatedStyle(() => {
    const lowGap =
      REST_HALF +
      SLIDER_THUMB_GAP +
      (PRESSED_HALF - REST_HALF) * lowPressed.value
    const highGap =
      REST_HALF +
      SLIDER_THUMB_GAP +
      (PRESSED_HALF - REST_HALF) * highPressed.value
    const lowFade = Math.min(1, Math.max(0, (lowDist - lowGap) / 2))
    const highFade = hasHigh
      ? Math.min(1, Math.max(0, (highDist - highGap) / 2))
      : 1
    return { opacity: Math.min(lowFade, highFade) }
  }, [cx, lowPos, highPos, hasHigh])

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        baseStyle,
        disabledStyle,
        { left: cx - SLIDER_TICK_SIZE / 2 },
        animatedStyle,
      ]}
    />
  )
}

export function Slider({
  value: controlledValue,
  defaultValue,
  onValueChange,
  onSlidingComplete,
  minimumValue = 0,
  maximumValue = 1,
  step = 0,
  centered = false,
  showTickMarks,
  showValueLabel = true,
  formatValueLabel,
  startIcon,
  endIcon,
  containerColor,
  contentColor,
  inactiveTrackColor,
  disabled = false,
  style,
  accessibilityLabel,
  ...rest
}: SliderProps) {
  const theme = useTheme()
  const iconResolver = useIconResolver()
  const styles = useMemo(
    () => createStyles(theme, containerColor, contentColor, inactiveTrackColor),
    [theme, containerColor, contentColor, inactiveTrackColor],
  )

  const isRange = Array.isArray(controlledValue) || Array.isArray(defaultValue)
  const isDisabled = Boolean(disabled)
  const isRTL = I18nManager.isRTL

  const initialValue = useMemo<SliderValue>(() => {
    if (defaultValue !== undefined) return defaultValue
    if (controlledValue !== undefined) return controlledValue
    return isRange
      ? ([minimumValue, maximumValue] as [number, number])
      : minimumValue
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [internalValue, setInternalValue] = useState<SliderValue>(initialValue)
  const value = controlledValue ?? internalValue

  const valueRef = useRef<SliderValue>(value)
  useEffect(() => {
    valueRef.current = value
  }, [value])

  const [trackWidth, setTrackWidth] = useState(0)
  const trackWidthRef = useRef(0)
  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    trackWidthRef.current = w
    setTrackWidth(w)
  }, [])

  const [activeThumb, setActiveThumb] = useState<ThumbId | null>(null)
  const activeThumbRef = useRef<ThumbId | null>(null)

  const [labelWidths, setLabelWidths] = useState<{ low: number; high: number }>(
    { low: 0, high: 0 },
  )
  const onLowLabelLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    setLabelWidths((s) => (s.low === w ? s : { ...s, low: w }))
  }, [])
  const onHighLabelLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    setLabelWidths((s) => (s.high === w ? s : { ...s, high: w }))
  }, [])

  const range = Math.max(maximumValue - minimumValue, 1e-9)

  const valueToPosition = useCallback(
    (v: number) => {
      const ratio = (v - minimumValue) / range
      const px = ratio * trackWidth
      return isRTL ? trackWidth - px : px
    },
    [minimumValue, range, trackWidth, isRTL],
  )

  const positionToValue = useCallback(
    (px: number) => {
      const w = trackWidthRef.current || 1
      const adjusted = isRTL ? w - px : px
      const ratio = clamp(adjusted / w, 0, 1)
      const raw = minimumValue + ratio * range
      return clamp(
        snapToStep(raw, step, minimumValue),
        minimumValue,
        maximumValue,
      )
    },
    [minimumValue, maximumValue, range, step, isRTL],
  )

  const commitValue = useCallback(
    (next: SliderValue, complete: boolean) => {
      const prev = valueRef.current
      const changed = Array.isArray(prev)
        ? !Array.isArray(next) || prev[0] !== next[0] || prev[1] !== next[1]
        : prev !== next

      if (changed) {
        if (controlledValue === undefined) {
          setInternalValue(next)
        }
        valueRef.current = next
        onValueChange?.(next)
      }
      if (complete) onSlidingComplete?.(next)
    },
    [controlledValue, onValueChange, onSlidingComplete],
  )

  const handleTouch = useCallback(
    (locationX: number, complete: boolean) => {
      const v = positionToValue(locationX)
      const current = valueRef.current

      if (Array.isArray(current)) {
        const [low, high] = current
        let which = activeThumbRef.current
        if (!which) {
          which = Math.abs(v - low) <= Math.abs(v - high) ? 'low' : 'high'
          activeThumbRef.current = which
          setActiveThumb(which)
        }
        const next: [number, number] =
          which === 'low' ? [Math.min(v, high), high] : [low, Math.max(v, low)]
        commitValue(next, complete)
      } else {
        if (!activeThumbRef.current) {
          activeThumbRef.current = 'low'
          setActiveThumb('low')
        }
        commitValue(v, complete)
      }
    },
    [commitValue, positionToValue],
  )

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isDisabled,
        onStartShouldSetPanResponderCapture: () => !isDisabled,
        onMoveShouldSetPanResponder: () => !isDisabled,
        onMoveShouldSetPanResponderCapture: () => !isDisabled,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e: GestureResponderEvent) => {
          handleTouch(e.nativeEvent.locationX, false)
        },
        onPanResponderMove: (e: GestureResponderEvent) => {
          handleTouch(e.nativeEvent.locationX, false)
        },
        onPanResponderRelease: (e: GestureResponderEvent) => {
          handleTouch(e.nativeEvent.locationX, true)
          activeThumbRef.current = null
          setActiveThumb(null)
        },
        onPanResponderTerminate: () => {
          activeThumbRef.current = null
          setActiveThumb(null)
        },
      }),
    [isDisabled, handleTouch],
  )

  const arrValue = Array.isArray(value) ? value : null
  const lowValue = arrValue ? arrValue[0] : (value as number)
  const highValue = arrValue ? arrValue[1] : (value as number)

  // Thumb pixel positions in render-space (LTR coordinates inside the track).
  const lowPos = valueToPosition(lowValue)
  const highPos = valueToPosition(highValue)
  const centerPos = trackWidth / 2

  // Press progress per thumb (0 → 1) lives on the UI thread so the thumb's
  // 4 → 16 dp grow can run in lockstep with the surrounding segments and stop
  // indicators that depend on the same value. Hover and focus drive the same
  // state-layer halo at lower opacities and don't affect layout.
  const lowPressed = useSharedValue(0)
  const highPressed = useSharedValue(0)
  const lowHovered = useSharedValue(0)
  const highHovered = useSharedValue(0)
  const lowFocused = useSharedValue(0)
  const highFocused = useSharedValue(0)
  const lowLabelOpacity = useSharedValue(0)
  const highLabelOpacity = useSharedValue(0)

  // The single Pressable wrapper has one focus target. For range sliders we
  // route keyboard adjustments and focus indication to the thumb the user is
  // currently interacting with — `keyboardThumb`. It defaults to 'low', flips
  // to whichever thumb pan-gestured last, and can be toggled with Enter/Space.
  const [keyboardThumb, setKeyboardThumb] = useState<ThumbId>('low')
  const isHovered = useRef(false)
  const isFocused = useRef(false)

  useEffect(() => {
    if (activeThumb) setKeyboardThumb(activeThumb)
  }, [activeThumb])

  useEffect(() => {
    lowPressed.value = withSpring(activeThumb === 'low' ? 1 : 0, PRESS_SPRING)
  }, [activeThumb, lowPressed])

  useEffect(() => {
    highPressed.value = withSpring(activeThumb === 'high' ? 1 : 0, PRESS_SPRING)
  }, [activeThumb, highPressed])

  // Track segment specs. Geometry is rest-time only; the worklet adds press
  // shifts based on shared values. Segment KIND/COUNT still depends on JS
  // state (value, centered, range) because corners and stop placement change
  // with configuration — but pixel positions interpolate on the UI thread.
  const segments = useMemo<Segment[]>(() => {
    if (trackWidth <= 0) return []

    const out: Segment[] = []
    const outer = SLIDER_TRACK_CORNER_OUTER
    const inner = SLIDER_TRACK_CORNER_INNER

    if (arrValue) {
      // RANGE: inactive | active | inactive. We label which underlying thumb is
      // currently the visually-left one so its press shift attaches to the
      // right edge of the left inactive segment (and vice versa).
      const lowIsLeft = lowPos <= highPos
      const leftPos = lowIsLeft ? lowPos : highPos
      const rightPos = lowIsLeft ? highPos : lowPos
      const leftId: ThumbId = lowIsLeft ? 'low' : 'high'
      const rightId: ThumbId = lowIsLeft ? 'high' : 'low'

      const aStart = fixedEdge(0)
      const aEnd = leftThumbEdge(leftPos, leftId)
      const bStart = rightThumbEdge(leftPos, leftId)
      const bEnd = leftThumbEdge(rightPos, rightId)
      const cStart = rightThumbEdge(rightPos, rightId)
      const cEnd = fixedEdge(trackWidth)

      if (aEnd.rest > aStart.rest) {
        out.push({
          kind: 'inactive',
          start: aStart,
          end: aEnd,
          cornerLeft: outer,
          cornerRight: inner,
          stopAt: { fromStart: true, offset: STOP_OFFSET },
        })
      }
      if (bEnd.rest > bStart.rest) {
        out.push({
          kind: 'active',
          start: bStart,
          end: bEnd,
          cornerLeft: inner,
          cornerRight: inner,
          stopAt: null,
        })
      }
      if (cEnd.rest > cStart.rest) {
        out.push({
          kind: 'inactive',
          start: cStart,
          end: cEnd,
          cornerLeft: inner,
          cornerRight: outer,
          stopAt: { fromStart: false, offset: STOP_OFFSET },
        })
      }
      return out
    }

    if (centered) {
      const tPos = lowPos
      // Threshold check uses REST geometry. Inside this branch the thumb is
      // close enough to the midpoint that the active segment vanishes at rest;
      // both surrounding inactive segments still need their inner edges to
      // chase the thumb on press, which the EdgeData shift handles.
      if (Math.abs(tPos - centerPos) < REST_HALF + SLIDER_THUMB_GAP) {
        const leftEnd = leftThumbEdge(tPos, 'low')
        const rightStart = rightThumbEdge(tPos, 'low')
        if (leftEnd.rest > 0) {
          out.push({
            kind: 'inactive',
            start: fixedEdge(0),
            end: leftEnd,
            cornerLeft: outer,
            cornerRight: inner,
            stopAt: { fromStart: true, offset: STOP_OFFSET },
          })
        }
        if (rightStart.rest < trackWidth) {
          out.push({
            kind: 'inactive',
            start: rightStart,
            end: fixedEdge(trackWidth),
            cornerLeft: inner,
            cornerRight: outer,
            stopAt: { fromStart: false, offset: STOP_OFFSET },
          })
        }
        return out
      }

      if (tPos > centerPos) {
        // Thumb right of center. The left-inactive's right edge hugs the
        // center marker at rest, but on press the thumb's gap zone can extend
        // *past* the marker — `withMin` keeps the segment from overlapping the
        // pressed thumb in that narrow band.
        const aStart = fixedEdge(0)
        const aEnd = withMin(
          fixedEdge(centerPos - 1),
          leftThumbEdge(tPos, 'low'),
        )
        const bStart = fixedEdge(centerPos + 1)
        const bEnd = leftThumbEdge(tPos, 'low')
        const cStart = rightThumbEdge(tPos, 'low')
        const cEnd = fixedEdge(trackWidth)

        if (aEnd.rest > 0) {
          out.push({
            kind: 'inactive',
            start: aStart,
            end: aEnd,
            cornerLeft: outer,
            cornerRight: inner,
            stopAt: { fromStart: true, offset: STOP_OFFSET },
          })
        }
        if (bEnd.rest > bStart.rest) {
          out.push({
            kind: 'active',
            start: bStart,
            end: bEnd,
            cornerLeft: inner,
            cornerRight: inner,
            stopAt: null,
          })
        }
        if (cStart.rest < trackWidth) {
          out.push({
            kind: 'inactive',
            start: cStart,
            end: cEnd,
            cornerLeft: inner,
            cornerRight: outer,
            stopAt: { fromStart: false, offset: STOP_OFFSET },
          })
        }
      } else {
        // Thumb left of center (mirror case). cStart's lower bound is the
        // pressed thumb's right gap-zone edge, applied via `withMax`.
        const aStart = fixedEdge(0)
        const aEnd = leftThumbEdge(tPos, 'low')
        const bStart = rightThumbEdge(tPos, 'low')
        const bEnd = fixedEdge(centerPos - 1)
        const cStart = withMax(
          fixedEdge(centerPos + 1),
          rightThumbEdge(tPos, 'low'),
        )
        const cEnd = fixedEdge(trackWidth)

        if (aEnd.rest > 0) {
          out.push({
            kind: 'inactive',
            start: aStart,
            end: aEnd,
            cornerLeft: outer,
            cornerRight: inner,
            stopAt: { fromStart: true, offset: STOP_OFFSET },
          })
        }
        if (bEnd.rest > bStart.rest) {
          out.push({
            kind: 'active',
            start: bStart,
            end: bEnd,
            cornerLeft: inner,
            cornerRight: inner,
            stopAt: null,
          })
        }
        if (cStart.rest < trackWidth) {
          out.push({
            kind: 'inactive',
            start: cStart,
            end: cEnd,
            cornerLeft: inner,
            cornerRight: outer,
            stopAt: { fromStart: false, offset: STOP_OFFSET },
          })
        }
      }
      return out
    }

    // SINGLE non-centered.
    const tPos = lowPos
    if (isRTL) {
      const aStart = fixedEdge(0)
      const aEnd = leftThumbEdge(tPos, 'low')
      const bStart = rightThumbEdge(tPos, 'low')
      const bEnd = fixedEdge(trackWidth)
      if (aEnd.rest > aStart.rest) {
        out.push({
          kind: 'inactive',
          start: aStart,
          end: aEnd,
          cornerLeft: outer,
          cornerRight: inner,
          stopAt: { fromStart: true, offset: STOP_OFFSET },
        })
      }
      if (bEnd.rest > bStart.rest) {
        out.push({
          kind: 'active',
          start: bStart,
          end: bEnd,
          cornerLeft: inner,
          cornerRight: outer,
          stopAt: null,
        })
      }
    } else {
      const aStart = fixedEdge(0)
      const aEnd = leftThumbEdge(tPos, 'low')
      const bStart = rightThumbEdge(tPos, 'low')
      const bEnd = fixedEdge(trackWidth)
      if (aEnd.rest > aStart.rest) {
        out.push({
          kind: 'active',
          start: aStart,
          end: aEnd,
          cornerLeft: outer,
          cornerRight: inner,
          stopAt: null,
        })
      }
      if (bEnd.rest > bStart.rest) {
        out.push({
          kind: 'inactive',
          start: bStart,
          end: bEnd,
          cornerLeft: inner,
          cornerRight: outer,
          stopAt: { fromStart: false, offset: STOP_OFFSET },
        })
      }
    }
    return out
  }, [arrValue, centered, centerPos, highPos, isRTL, lowPos, trackWidth])

  // Tick marks (discrete only). `showTickMarks` defaults to true when step>0.
  const ticksEnabled = showTickMarks ?? (Boolean(step) && step > 0)
  const tickValues = useMemo(() => {
    if (!ticksEnabled || !step || step <= 0) return [] as number[]
    const out: number[] = []
    const tolerance = step / 2
    for (let v = minimumValue; v <= maximumValue + tolerance; v += step) {
      out.push(Math.min(v, maximumValue))
    }
    return out
  }, [ticksEnabled, step, minimumValue, maximumValue])

  const isTickActive = useCallback(
    (tickV: number) => {
      if (arrValue) {
        return (
          tickV >= Math.min(lowValue, highValue) &&
          tickV <= Math.max(lowValue, highValue)
        )
      }
      if (centered) {
        const mid = (minimumValue + maximumValue) / 2
        return (
          (tickV >= mid && tickV <= lowValue) ||
          (tickV <= mid && tickV >= lowValue)
        )
      }
      return tickV <= lowValue
    },
    [arrValue, lowValue, highValue, centered, minimumValue, maximumValue],
  )

  const formatLabel =
    formatValueLabel ?? ((v: number) => defaultFormat(v, step))

  const labelMode = showValueLabel
  const showLowLabel =
    !isDisabled &&
    (labelMode === 'always' || (labelMode === true && activeThumb === 'low'))
  const showHighLabel =
    !isDisabled &&
    arrValue !== null &&
    (labelMode === 'always' || (labelMode === true && activeThumb === 'high'))

  useEffect(() => {
    lowLabelOpacity.value = withTiming(showLowLabel ? 1 : 0, LABEL_TIMING)
  }, [showLowLabel, lowLabelOpacity])

  useEffect(() => {
    highLabelOpacity.value = withTiming(showHighLabel ? 1 : 0, LABEL_TIMING)
  }, [showHighLabel, highLabelOpacity])

  // Hover/focus indicator routing: only the keyboardThumb shows the halo
  // (single-thumb mode → always 'low'; range mode → most-recent thumb).
  useEffect(() => {
    const lowOn = isHovered.current && keyboardThumb === 'low' && !isDisabled
    const highOn = isHovered.current && keyboardThumb === 'high' && !isDisabled
    lowHovered.value = withTiming(lowOn ? 1 : 0, STATE_LAYER_TIMING)
    highHovered.value = withTiming(highOn ? 1 : 0, STATE_LAYER_TIMING)
  }, [keyboardThumb, isDisabled, lowHovered, highHovered])

  useEffect(() => {
    const lowOn = isFocused.current && keyboardThumb === 'low' && !isDisabled
    const highOn = isFocused.current && keyboardThumb === 'high' && !isDisabled
    lowFocused.value = withTiming(lowOn ? 1 : 0, FOCUS_RING_TIMING)
    highFocused.value = withTiming(highOn ? 1 : 0, FOCUS_RING_TIMING)
  }, [keyboardThumb, isDisabled, lowFocused, highFocused])

  // Keyboard / a11y action step. For continuous sliders, MD3 spec calls for
  // ~1 % of the range per arrow tap; for discrete sliders, one step.
  const keyStep = step > 0 ? step : range / 100

  const adjustValue = useCallback(
    (delta: number) => {
      const current = valueRef.current
      if (Array.isArray(current)) {
        const [low, high] = current
        if (keyboardThumb === 'low') {
          const next = clamp(
            snapToStep(low + delta, step, minimumValue),
            minimumValue,
            maximumValue,
          )
          commitValue([Math.min(next, high), high], true)
        } else {
          const next = clamp(
            snapToStep(high + delta, step, minimumValue),
            minimumValue,
            maximumValue,
          )
          commitValue([low, Math.max(next, low)], true)
        }
      } else {
        const next = clamp(
          snapToStep((current as number) + delta, step, minimumValue),
          minimumValue,
          maximumValue,
        )
        commitValue(next, true)
      }
    },
    [commitValue, keyboardThumb, maximumValue, minimumValue, step],
  )

  const handleHoverIn = useCallback(() => {
    if (isDisabled) return
    isHovered.current = true
    if (keyboardThumb === 'low') {
      lowHovered.value = withTiming(1, STATE_LAYER_TIMING)
    } else {
      highHovered.value = withTiming(1, STATE_LAYER_TIMING)
    }
  }, [isDisabled, keyboardThumb, lowHovered, highHovered])

  const handleHoverOut = useCallback(() => {
    isHovered.current = false
    lowHovered.value = withTiming(0, STATE_LAYER_TIMING)
    highHovered.value = withTiming(0, STATE_LAYER_TIMING)
  }, [lowHovered, highHovered])

  const handleFocus = useCallback(() => {
    if (isDisabled || !isFocusVisible()) return
    isFocused.current = true
    if (keyboardThumb === 'low') {
      lowFocused.value = withTiming(1, FOCUS_RING_TIMING)
    } else {
      highFocused.value = withTiming(1, FOCUS_RING_TIMING)
    }
  }, [isDisabled, keyboardThumb, lowFocused, highFocused])

  const handleBlur = useCallback(() => {
    isFocused.current = false
    lowFocused.value = withTiming(0, FOCUS_RING_TIMING)
    highFocused.value = withTiming(0, FOCUS_RING_TIMING)
  }, [lowFocused, highFocused])

  const handleAccessibilityAction = useCallback(
    (e: AccessibilityActionEvent) => {
      if (isDisabled) return
      if (e.nativeEvent.actionName === 'increment') {
        adjustValue(isRTL ? -keyStep : keyStep)
      } else if (e.nativeEvent.actionName === 'decrement') {
        adjustValue(isRTL ? keyStep : -keyStep)
      }
    },
    [adjustValue, isDisabled, isRTL, keyStep],
  )

  // Web keyboard support. RN web forwards onKeyDown on Pressable to the
  // underlying DOM element; native platforms ignore it (a11y actions cover
  // VoiceOver/TalkBack adjustments).
  const handleKeyDown = useCallback(
    (e: { nativeEvent: { key?: string } }) => {
      if (isDisabled) return
      const key = e.nativeEvent.key
      if (!key) return
      const bigStep = Math.max(keyStep * 10, range / 10)
      switch (key) {
        case 'ArrowRight':
          adjustValue(isRTL ? -keyStep : keyStep)
          break
        case 'ArrowLeft':
          adjustValue(isRTL ? keyStep : -keyStep)
          break
        case 'ArrowUp':
          adjustValue(keyStep)
          break
        case 'ArrowDown':
          adjustValue(-keyStep)
          break
        case 'PageUp':
          adjustValue(bigStep)
          break
        case 'PageDown':
          adjustValue(-bigStep)
          break
        case 'Home':
          commitValue(
            arrValue
              ? keyboardThumb === 'low'
                ? [minimumValue, arrValue[1]]
                : [arrValue[0], Math.max(minimumValue, arrValue[0])]
              : minimumValue,
            true,
          )
          break
        case 'End':
          commitValue(
            arrValue
              ? keyboardThumb === 'low'
                ? [Math.min(maximumValue, arrValue[1]), arrValue[1]]
                : [arrValue[0], maximumValue]
              : maximumValue,
            true,
          )
          break
        case 'Enter':
        case ' ':
          // Toggle which thumb the keyboard adjusts in range mode. No-op for
          // single-thumb sliders.
          if (arrValue) {
            setKeyboardThumb((t) => (t === 'low' ? 'high' : 'low'))
          }
          break
      }
    },
    [
      adjustValue,
      arrValue,
      commitValue,
      isDisabled,
      isRTL,
      keyStep,
      keyboardThumb,
      maximumValue,
      minimumValue,
      range,
    ],
  )

  const accessibilityValue = arrValue
    ? {
        min: Math.round(minimumValue),
        max: Math.round(maximumValue),
        now: Math.round(arrValue[0]),
        text: `${formatLabel(arrValue[0])} to ${formatLabel(arrValue[1])}`,
      }
    : {
        min: Math.round(minimumValue),
        max: Math.round(maximumValue),
        now: Math.round(lowValue),
        text: formatLabel(lowValue),
      }

  return (
    <View {...rest} style={[styles.root, style]}>
      {startIcon ? (
        <View style={styles.decoration}>
          {renderIcon(
            startIcon,
            {
              size: ICON_SIZE,
              color: isDisabled
                ? styles.disabledThumb.backgroundColor
                : styles.decorationIconColor.color,
            },
            iconResolver,
          )}
        </View>
      ) : null}

      <Pressable
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isDisabled }}
        accessibilityValue={accessibilityValue}
        accessibilityActions={ACCESSIBILITY_ACTIONS}
        onAccessibilityAction={handleAccessibilityAction}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
        // Web only: arrow / Page / Home / End / Enter handling. Native ignores.
        {...({ onKeyDown: handleKeyDown } as object)}
        disabled={isDisabled}
        style={styles.pressableWrapper}
      >
        <View
          {...panResponder.panHandlers}
          onLayout={onTrackLayout}
          style={styles.trackArea}
        >
          {segments.map((seg, i) => {
            const baseStyle =
              seg.kind === 'active'
                ? styles.activeSegment
                : styles.inactiveSegment
            const disabledStyle = isDisabled
              ? seg.kind === 'active'
                ? styles.disabledActiveSegment
                : styles.disabledInactiveSegment
              : undefined
            return (
              <Fragment key={`seg-${i}`}>
                <SegmentSlot
                  segment={seg}
                  lowPressed={lowPressed}
                  highPressed={highPressed}
                  baseStyle={baseStyle}
                  kindStyle={baseStyle}
                  disabledStyle={disabledStyle}
                />
                {seg.stopAt ? (
                  <StopIndicatorSlot
                    segment={seg}
                    lowPressed={lowPressed}
                    highPressed={highPressed}
                    baseStyle={styles.stopIndicator}
                    kindStyle={
                      seg.kind === 'active'
                        ? styles.stopOnActive
                        : styles.stopOnInactive
                    }
                    disabledStyle={isDisabled ? styles.disabledTick : undefined}
                  />
                ) : null}
              </Fragment>
            )
          })}

          {tickValues.map((tickV, i) => {
            const cx = valueToPosition(tickV)
            const active = isTickActive(tickV)
            return (
              <TickSlot
                key={`tick-${i}`}
                cx={cx}
                lowPos={lowPos}
                highPos={highPos}
                hasHigh={arrValue !== null}
                lowPressed={lowPressed}
                highPressed={highPressed}
                baseStyle={active ? styles.tickActive : styles.tickInactive}
                disabledStyle={isDisabled ? styles.disabledTick : undefined}
              />
            )
          })}

          {!isDisabled ? (
            <FocusRingSlot
              centerX={lowPos}
              focused={lowFocused}
              baseStyle={styles.focusRing}
            />
          ) : null}
          {!isDisabled && arrValue ? (
            <FocusRingSlot
              centerX={highPos}
              focused={highFocused}
              baseStyle={styles.focusRing}
            />
          ) : null}

          {!isDisabled ? (
            <StateLayerSlot
              centerX={lowPos}
              hovered={lowHovered}
              focused={lowFocused}
              pressed={lowPressed}
              baseStyle={styles.stateLayer}
            />
          ) : null}
          {!isDisabled && arrValue ? (
            <StateLayerSlot
              centerX={highPos}
              hovered={highHovered}
              focused={highFocused}
              pressed={highPressed}
              baseStyle={styles.stateLayer}
            />
          ) : null}

          <ThumbSlot
            thumbId="low"
            centerX={lowPos}
            pressed={lowPressed}
            baseStyle={styles.thumb}
            disabledStyle={isDisabled ? styles.disabledThumb : undefined}
          />
          {arrValue ? (
            <ThumbSlot
              thumbId="high"
              centerX={highPos}
              pressed={highPressed}
              baseStyle={styles.thumb}
              disabledStyle={isDisabled ? styles.disabledThumb : undefined}
            />
          ) : null}

          {labelMode !== false ? (
            <ValueLabelSlot
              centerX={lowPos}
              labelWidth={labelWidths.low}
              opacity={lowLabelOpacity}
              onLayout={onLowLabelLayout}
              baseStyle={styles.valueLabel}
              textStyle={styles.valueLabelText}
              text={formatLabel(lowValue)}
            />
          ) : null}
          {labelMode !== false && arrValue ? (
            <ValueLabelSlot
              centerX={highPos}
              labelWidth={labelWidths.high}
              opacity={highLabelOpacity}
              onLayout={onHighLabelLayout}
              baseStyle={styles.valueLabel}
              textStyle={styles.valueLabelText}
              text={formatLabel(highValue)}
            />
          ) : null}
        </View>
      </Pressable>

      {endIcon ? (
        <View style={styles.decoration}>
          {renderIcon(
            endIcon,
            {
              size: ICON_SIZE,
              color: isDisabled
                ? styles.disabledThumb.backgroundColor
                : styles.decorationIconColor.color,
            },
            iconResolver,
          )}
        </View>
      ) : null}
    </View>
  )
}
