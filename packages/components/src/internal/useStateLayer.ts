const DEFAULT_BG_TRANSITION = { type: 'timing', duration: 150 } as const
const DEFAULT_FOCUS_RING_TRANSITION = {
  type: 'timing',
  duration: 200,
} as const

const FOCUS_RING_INITIAL = { opacity: 0 } as const
const FOCUS_RING_VISIBLE_GESTURE = {
  focusVisible: { opacity: 1 },
} as const

export interface StateLayerColors {
  rest: string
  hovered: string
  focused: string
  pressed: string
  disabled?: string
}

export interface StateLayerTransition {
  type: 'timing'
  duration: number
}

export interface UseStateLayerOptions {
  colors: StateLayerColors
  isDisabled: boolean
  bgTransition?: StateLayerTransition
  focusRingTransition?: StateLayerTransition
}

// MD3 state-layer cascade for Inertia. Resolves rest/hover/focus/press
// background-color targets and the focus-ring opacity gesture.
//
// Why no memoization: Inertia diffs `animate` / `gesture` / `transition` via
// its own `stableSig` (createMotionComponent.tsx) before re-running animation
// effects, so consumer-side `useMemo` doesn't change correctness — fresh
// object literals each render are fine. We also omit `initial` on the
// container; Inertia seeds the SV from `animate.backgroundColor` via
// `restValue` when `initial` is undefined.
export function useStateLayer({
  colors,
  isDisabled,
  bgTransition = DEFAULT_BG_TRANSITION,
  focusRingTransition = DEFAULT_FOCUS_RING_TRANSITION,
}: UseStateLayerOptions) {
  const restBg =
    isDisabled && colors.disabled !== undefined ? colors.disabled : colors.rest

  return {
    container: {
      animate: { backgroundColor: restBg },
      gesture: isDisabled
        ? undefined
        : {
            hovered: { backgroundColor: colors.hovered },
            focusVisible: { backgroundColor: colors.focused },
            pressed: { backgroundColor: colors.pressed },
          },
      transition: { backgroundColor: bgTransition },
    },
    focusRing: {
      initial: FOCUS_RING_INITIAL,
      gesture: isDisabled ? undefined : FOCUS_RING_VISIBLE_GESTURE,
      transition: { opacity: focusRingTransition },
    },
  }
}
