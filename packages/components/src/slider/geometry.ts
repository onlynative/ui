import {
  SLIDER_STOP_INDICATOR,
  SLIDER_THUMB_GAP,
  SLIDER_THUMB_WIDTH,
  SLIDER_THUMB_WIDTH_PRESSED,
} from './styles'

export type ThumbId = 'low' | 'high'

export const REST_HALF = SLIDER_THUMB_WIDTH / 2
export const PRESSED_HALF = SLIDER_THUMB_WIDTH_PRESSED / 2
// Per-edge shift between rest and fully pressed thumb. Positive means the edge
// moves to the right on press (e.g. the right side of a thumb's gap zone).
export const PRESS_DELTA = PRESSED_HALF - REST_HALF
export const STOP_OFFSET = SLIDER_STOP_INDICATOR / 2 + 2

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
export interface EdgeAtom {
  rest: number
  shift: number
  thumbId: ThumbId | null
}
export interface EdgeData extends EdgeAtom {
  bound?: { kind: 'min' | 'max' } & EdgeAtom
}

export interface Segment {
  kind: 'active' | 'inactive'
  start: EdgeData
  end: EdgeData
  cornerLeft: number
  cornerRight: number
  // For inactive segments, where to put the stop indicator: a fixed offset
  // measured from either the leading edge (`fromStart: true`) or trailing edge.
  stopAt: { fromStart: boolean; offset: number } | null
}

export const fixedEdge = (rest: number): EdgeData => ({
  rest,
  shift: 0,
  thumbId: null,
})

export const leftThumbEdge = (
  thumbPos: number,
  thumbId: ThumbId,
): EdgeData => ({
  rest: thumbPos - REST_HALF - SLIDER_THUMB_GAP,
  shift: -PRESS_DELTA,
  thumbId,
})

export const rightThumbEdge = (
  thumbPos: number,
  thumbId: ThumbId,
): EdgeData => ({
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

export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max)

export const snapToStep = (v: number, step: number, min: number) => {
  if (!step || step <= 0) return v
  return Math.round((v - min) / step) * step + min
}

export const defaultFormat = (v: number, step: number) => {
  if (!step || step <= 0) return String(Math.round(v * 100) / 100)
  if (step >= 1) return String(Math.round(v))
  const decimals = Math.max(0, Math.ceil(-Math.log10(step)))
  return v.toFixed(decimals)
}

interface ComputeSegmentsArgs {
  trackWidth: number
  lowPos: number
  highPos: number
  centerPos: number
  isRange: boolean
  centered: boolean
  isRTL: boolean
  // When tick marks are rendered, the first/last tick already mark the track
  // ends; rendering stop indicators on top creates a doubled "extra dot" at
  // each edge. Per MD3, stops and ticks are mutually exclusive — pass false
  // here for discrete sliders with visible ticks.
  showStopIndicators: boolean
  outerCorner: number
  innerCorner: number
}

export function computeSegments({
  trackWidth,
  lowPos,
  highPos,
  centerPos,
  isRange,
  centered,
  isRTL,
  showStopIndicators,
  outerCorner: outer,
  innerCorner: inner,
}: ComputeSegmentsArgs): Segment[] {
  if (trackWidth <= 0) return []
  const stopAtStart = showStopIndicators
    ? { fromStart: true, offset: STOP_OFFSET }
    : null
  const stopAtEnd = showStopIndicators
    ? { fromStart: false, offset: STOP_OFFSET }
    : null
  const out: Segment[] = []

  if (isRange) {
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
        stopAt: stopAtStart,
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
        stopAt: stopAtEnd,
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
          stopAt: stopAtStart,
        })
      }
      if (rightStart.rest < trackWidth) {
        out.push({
          kind: 'inactive',
          start: rightStart,
          end: fixedEdge(trackWidth),
          cornerLeft: inner,
          cornerRight: outer,
          stopAt: stopAtEnd,
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
      const aEnd = withMin(fixedEdge(centerPos - 1), leftThumbEdge(tPos, 'low'))
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
          stopAt: stopAtStart,
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
          stopAt: stopAtEnd,
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
          stopAt: stopAtStart,
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
          stopAt: stopAtEnd,
        })
      }
    }
    return out
  }

  // SINGLE non-centered.
  const tPos = lowPos
  const aStart = fixedEdge(0)
  const aEnd = leftThumbEdge(tPos, 'low')
  const bStart = rightThumbEdge(tPos, 'low')
  const bEnd = fixedEdge(trackWidth)
  if (isRTL) {
    if (aEnd.rest > aStart.rest) {
      out.push({
        kind: 'inactive',
        start: aStart,
        end: aEnd,
        cornerLeft: outer,
        cornerRight: inner,
        stopAt: stopAtStart,
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
        stopAt: stopAtEnd,
      })
    }
  }
  return out
}
