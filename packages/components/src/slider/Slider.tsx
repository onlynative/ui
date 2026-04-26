import { useIconResolver, useTheme } from '@onlynative/core'
import { renderIcon } from '@onlynative/utils'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native'
import { I18nManager, PanResponder, Text, View } from 'react-native'
import {
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

// Track segment with the four independent corner radii so the inner end
// (facing a thumb gap or the centered midpoint) can be 2dp while the outer
// end stays at the 8dp pill radius — per MD3 expressive spec.
interface Segment {
  kind: 'active' | 'inactive'
  start: number
  end: number
  cornerLeft: number
  cornerRight: number
  // For inactive segments only: where to put the stop indicator (absolute x
  // of its center) or null if none.
  stopAt: number | null
}

const ICON_SIZE = 18

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
  // Sort low/high by render position so range thumbs drawn correctly under RTL.
  const lowPos = valueToPosition(lowValue)
  const highPos = valueToPosition(highValue)
  const centerPos = trackWidth / 2

  const lowPressed = activeThumb === 'low'
  const highPressed = activeThumb === 'high'
  const lowThumbWidth = lowPressed
    ? SLIDER_THUMB_WIDTH_PRESSED
    : SLIDER_THUMB_WIDTH
  const highThumbWidth = highPressed
    ? SLIDER_THUMB_WIDTH_PRESSED
    : SLIDER_THUMB_WIDTH

  // Build the list of track segments for this configuration. Each segment
  // ends with a 6dp visible gap before/after a thumb (or the centered
  // midpoint), and the corner facing the gap is the inner 2dp radius while
  // the far corner stays at the outer 8dp pill radius.
  const segments = useMemo<Segment[]>(() => {
    if (trackWidth <= 0) return []

    const out: Segment[] = []
    const outer = SLIDER_TRACK_CORNER_OUTER
    const inner = SLIDER_TRACK_CORNER_INNER

    if (arrValue) {
      // RANGE: inactive | active | inactive
      const leftPos = Math.min(lowPos, highPos)
      const rightPos = Math.max(lowPos, highPos)
      const leftWidth = leftPos === lowPos ? lowThumbWidth : highThumbWidth
      const rightWidth = rightPos === lowPos ? lowThumbWidth : highThumbWidth

      const aStart = 0
      const aEnd = leftPos - leftWidth / 2 - SLIDER_THUMB_GAP
      const bStart = leftPos + leftWidth / 2 + SLIDER_THUMB_GAP
      const bEnd = rightPos - rightWidth / 2 - SLIDER_THUMB_GAP
      const cStart = rightPos + rightWidth / 2 + SLIDER_THUMB_GAP
      const cEnd = trackWidth

      if (aEnd > aStart) {
        out.push({
          kind: 'inactive',
          start: aStart,
          end: aEnd,
          cornerLeft: outer,
          cornerRight: inner,
          stopAt: aStart + SLIDER_STOP_INDICATOR / 2 + 2,
        })
      }
      if (bEnd > bStart) {
        out.push({
          kind: 'active',
          start: bStart,
          end: bEnd,
          cornerLeft: inner,
          cornerRight: inner,
          stopAt: null,
        })
      }
      if (cEnd > cStart) {
        out.push({
          kind: 'inactive',
          start: cStart,
          end: cEnd,
          cornerLeft: inner,
          cornerRight: outer,
          stopAt: cEnd - SLIDER_STOP_INDICATOR / 2 - 2,
        })
      }
      return out
    }

    if (centered) {
      // CENTERED: thumb may be left or right of midpoint. Active fills from
      // midpoint to thumb; inactive fills the rest. A 6dp gap surrounds the
      // thumb; the active track also breaks at the midpoint with a 2dp inner
      // corner so the centered anchor is visually evident.
      const tPos = lowPos
      const tWidth = lowThumbWidth

      if (Math.abs(tPos - centerPos) < tWidth / 2 + SLIDER_THUMB_GAP) {
        // Thumb sits over the midpoint — render two inactive segments only.
        const leftEnd = tPos - tWidth / 2 - SLIDER_THUMB_GAP
        const rightStart = tPos + tWidth / 2 + SLIDER_THUMB_GAP
        if (leftEnd > 0) {
          out.push({
            kind: 'inactive',
            start: 0,
            end: leftEnd,
            cornerLeft: outer,
            cornerRight: inner,
            stopAt: SLIDER_STOP_INDICATOR / 2 + 2,
          })
        }
        if (rightStart < trackWidth) {
          out.push({
            kind: 'inactive',
            start: rightStart,
            end: trackWidth,
            cornerLeft: inner,
            cornerRight: outer,
            stopAt: trackWidth - SLIDER_STOP_INDICATOR / 2 - 2,
          })
        }
        return out
      }

      if (tPos > centerPos) {
        // Thumb is right of center.
        // [inactive 0..center] [active center..thumb] [inactive thumb..end]
        const aEnd = centerPos - 1
        const bStart = centerPos + 1
        const bEnd = tPos - tWidth / 2 - SLIDER_THUMB_GAP
        const cStart = tPos + tWidth / 2 + SLIDER_THUMB_GAP

        if (aEnd > 0) {
          out.push({
            kind: 'inactive',
            start: 0,
            end: aEnd,
            cornerLeft: outer,
            cornerRight: inner,
            stopAt: SLIDER_STOP_INDICATOR / 2 + 2,
          })
        }
        if (bEnd > bStart) {
          out.push({
            kind: 'active',
            start: bStart,
            end: bEnd,
            cornerLeft: inner,
            cornerRight: inner,
            stopAt: null,
          })
        }
        if (cStart < trackWidth) {
          out.push({
            kind: 'inactive',
            start: cStart,
            end: trackWidth,
            cornerLeft: inner,
            cornerRight: outer,
            stopAt: trackWidth - SLIDER_STOP_INDICATOR / 2 - 2,
          })
        }
      } else {
        // Thumb is left of center.
        // [inactive 0..thumb] [active thumb..center] [inactive center..end]
        const aEnd = tPos - tWidth / 2 - SLIDER_THUMB_GAP
        const bStart = tPos + tWidth / 2 + SLIDER_THUMB_GAP
        const bEnd = centerPos - 1
        const cStart = centerPos + 1

        if (aEnd > 0) {
          out.push({
            kind: 'inactive',
            start: 0,
            end: aEnd,
            cornerLeft: outer,
            cornerRight: inner,
            stopAt: SLIDER_STOP_INDICATOR / 2 + 2,
          })
        }
        if (bEnd > bStart) {
          out.push({
            kind: 'active',
            start: bStart,
            end: bEnd,
            cornerLeft: inner,
            cornerRight: inner,
            stopAt: null,
          })
        }
        if (cStart < trackWidth) {
          out.push({
            kind: 'inactive',
            start: cStart,
            end: trackWidth,
            cornerLeft: inner,
            cornerRight: outer,
            stopAt: trackWidth - SLIDER_STOP_INDICATOR / 2 - 2,
          })
        }
      }
      return out
    }

    // SINGLE non-centered (LTR): active fills from start to thumb; inactive
    // fills from thumb to end. Stop indicator at the trailing end of inactive.
    const tPos = lowPos
    const tWidth = lowThumbWidth
    if (isRTL) {
      // RTL — thumb position is mirrored; active fills from thumb to end.
      const aStart = 0
      const aEnd = tPos - tWidth / 2 - SLIDER_THUMB_GAP
      const bStart = tPos + tWidth / 2 + SLIDER_THUMB_GAP
      const bEnd = trackWidth
      if (aEnd > aStart) {
        out.push({
          kind: 'inactive',
          start: aStart,
          end: aEnd,
          cornerLeft: outer,
          cornerRight: inner,
          stopAt: aStart + SLIDER_STOP_INDICATOR / 2 + 2,
        })
      }
      if (bEnd > bStart) {
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
      const aStart = 0
      const aEnd = tPos - tWidth / 2 - SLIDER_THUMB_GAP
      const bStart = tPos + tWidth / 2 + SLIDER_THUMB_GAP
      const bEnd = trackWidth
      if (aEnd > aStart) {
        out.push({
          kind: 'active',
          start: aStart,
          end: aEnd,
          cornerLeft: outer,
          cornerRight: inner,
          stopAt: null,
        })
      }
      if (bEnd > bStart) {
        out.push({
          kind: 'inactive',
          start: bStart,
          end: bEnd,
          cornerLeft: inner,
          cornerRight: outer,
          stopAt: bEnd - SLIDER_STOP_INDICATOR / 2 - 2,
        })
      }
    }
    return out
  }, [
    arrValue,
    centered,
    centerPos,
    highPos,
    isRTL,
    lowPos,
    lowThumbWidth,
    highThumbWidth,
    trackWidth,
  ])

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

  // A tick is "active" (drawn over the active track region) when its value
  // falls inside the active value range. We use this to pick the contrasting
  // tick color.
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

  const renderThumb = (thumbId: ThumbId, centerX: number) => {
    const labelValue = thumbId === 'low' ? lowValue : highValue
    const showLabel = thumbId === 'low' ? showLowLabel : showHighLabel
    const labelWidth = thumbId === 'low' ? labelWidths.low : labelWidths.high
    const onLabelLayout =
      thumbId === 'low' ? onLowLabelLayout : onHighLabelLayout
    const w = thumbId === 'low' ? lowThumbWidth : highThumbWidth

    return (
      <Fragment key={thumbId}>
        <View
          pointerEvents="none"
          style={[
            styles.thumb,
            isDisabled ? styles.disabledThumb : undefined,
            {
              left: centerX - w / 2,
              width: w,
              borderRadius: w / 2,
            },
          ]}
        />
        {showLabel ? (
          <View
            pointerEvents="none"
            onLayout={onLabelLayout}
            style={[
              styles.valueLabel,
              labelWidth > 0 ? undefined : styles.valueLabelHidden,
              { left: centerX - labelWidth / 2 },
            ]}
          >
            <Text style={styles.valueLabelText} numberOfLines={1}>
              {formatLabel(labelValue)}
            </Text>
          </View>
        ) : null}
      </Fragment>
    )
  }

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

      <View
        {...panResponder.panHandlers}
        onLayout={onTrackLayout}
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isDisabled }}
        accessibilityValue={accessibilityValue}
        style={styles.trackArea}
      >
        {segments.map((seg, i) => {
          const w = Math.max(0, seg.end - seg.start)
          if (w <= 0) return null
          const base =
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
              <View
                pointerEvents="none"
                style={[
                  base,
                  disabledStyle,
                  {
                    left: seg.start,
                    width: w,
                    borderTopLeftRadius: seg.cornerLeft,
                    borderBottomLeftRadius: seg.cornerLeft,
                    borderTopRightRadius: seg.cornerRight,
                    borderBottomRightRadius: seg.cornerRight,
                  },
                ]}
              />
              {seg.stopAt !== null ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.stopIndicator,
                    seg.kind === 'active'
                      ? styles.stopOnActive
                      : styles.stopOnInactive,
                    isDisabled ? styles.disabledTick : undefined,
                    {
                      left: seg.stopAt - SLIDER_STOP_INDICATOR / 2,
                    },
                  ]}
                />
              ) : null}
            </Fragment>
          )
        })}

        {tickValues.map((tickV, i) => {
          const cx = valueToPosition(tickV)
          // Hide ticks that fall inside the thumb's gap zone — they'd visually
          // collide with the thumb and look messy.
          const insideLowGap =
            Math.abs(cx - lowPos) <= lowThumbWidth / 2 + SLIDER_THUMB_GAP
          const insideHighGap =
            arrValue !== null &&
            Math.abs(cx - highPos) <= highThumbWidth / 2 + SLIDER_THUMB_GAP
          if (insideLowGap || insideHighGap) return null
          const active = isTickActive(tickV)
          return (
            <View
              key={`tick-${i}`}
              pointerEvents="none"
              style={[
                active ? styles.tickActive : styles.tickInactive,
                isDisabled ? styles.disabledTick : undefined,
                {
                  left: cx - SLIDER_TICK_SIZE / 2,
                },
              ]}
            />
          )
        })}

        {renderThumb('low', lowPos)}
        {arrValue ? renderThumb('high', highPos) : null}
      </View>

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
