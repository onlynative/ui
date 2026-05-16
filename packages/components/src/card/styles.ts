import type { MaterialTheme } from '@onlynative/core'
import { alphaColor, blendColor, elevationStyle } from '@onlynative/utils'
import { StyleSheet } from 'react-native'
import type { CardVariant } from './types'

export const CARD_FOCUS_RING_OFFSET = 2
export const CARD_FOCUS_RING_WIDTH = 3

// MD3 state-layer opacity tokens. Card pins these to spec values rather than
// reading `theme.stateLayer.*` because the theme defaults drift from MD3
// (focus/press = 0.12 vs spec 0.10). If the theme tokens are realigned with
// MD3 later, swap these back to `theme.stateLayer.{focused,pressed}Opacity`.
const HOVER_OPACITY = 0.08
const FOCUS_OPACITY = 0.1
const PRESS_OPACITY = 0.1

export interface CardColors {
  backgroundColor: string
  borderColor: string
  borderWidth: number
  hoveredBackgroundColor: string
  focusedBackgroundColor: string
  pressedBackgroundColor: string
  disabledBackgroundColor: string
  disabledBorderColor: string
}

function blendStateLayer(
  base: string,
  overlay: string,
  opacity: number,
): string {
  if (base === 'transparent') {
    return alphaColor(overlay, opacity)
  }
  return blendColor(base, overlay, opacity)
}

function getVariantColors(
  theme: MaterialTheme,
  variant: CardVariant,
): CardColors {
  const disabledContainerColor = alphaColor(theme.colors.onSurface, 0.12)
  const disabledOutlineColor = alphaColor(theme.colors.onSurface, 0.12)

  if (variant === 'outlined') {
    return {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
      borderWidth: 1,
      hoveredBackgroundColor: blendStateLayer(
        theme.colors.surface,
        theme.colors.onSurface,
        HOVER_OPACITY,
      ),
      focusedBackgroundColor: blendStateLayer(
        theme.colors.surface,
        theme.colors.onSurface,
        FOCUS_OPACITY,
      ),
      pressedBackgroundColor: blendStateLayer(
        theme.colors.surface,
        theme.colors.onSurface,
        PRESS_OPACITY,
      ),
      disabledBackgroundColor: theme.colors.surface,
      disabledBorderColor: disabledOutlineColor,
    }
  }

  if (variant === 'filled') {
    return {
      backgroundColor: theme.colors.surfaceContainerHighest,
      borderColor: 'transparent',
      borderWidth: 0,
      hoveredBackgroundColor: blendColor(
        theme.colors.surfaceContainerHighest,
        theme.colors.onSurface,
        HOVER_OPACITY,
      ),
      focusedBackgroundColor: blendColor(
        theme.colors.surfaceContainerHighest,
        theme.colors.onSurface,
        FOCUS_OPACITY,
      ),
      pressedBackgroundColor: blendColor(
        theme.colors.surfaceContainerHighest,
        theme.colors.onSurface,
        PRESS_OPACITY,
      ),
      disabledBackgroundColor: disabledContainerColor,
      disabledBorderColor: 'transparent',
    }
  }

  // elevated (default)
  return {
    backgroundColor: theme.colors.surface,
    borderColor: 'transparent',
    borderWidth: 0,
    hoveredBackgroundColor: blendColor(
      theme.colors.surface,
      theme.colors.onSurface,
      HOVER_OPACITY,
    ),
    focusedBackgroundColor: blendColor(
      theme.colors.surface,
      theme.colors.onSurface,
      FOCUS_OPACITY,
    ),
    pressedBackgroundColor: blendColor(
      theme.colors.surface,
      theme.colors.onSurface,
      PRESS_OPACITY,
    ),
    disabledBackgroundColor: disabledContainerColor,
    disabledBorderColor: 'transparent',
  }
}

function applyContainerColorOverride(
  theme: MaterialTheme,
  colors: CardColors,
  containerColor?: string,
): CardColors {
  if (!containerColor) return colors

  return {
    ...colors,
    backgroundColor: containerColor,
    borderColor: containerColor,
    borderWidth: 0,
    hoveredBackgroundColor: blendColor(
      containerColor,
      theme.colors.onSurface,
      HOVER_OPACITY,
    ),
    focusedBackgroundColor: blendColor(
      containerColor,
      theme.colors.onSurface,
      FOCUS_OPACITY,
    ),
    pressedBackgroundColor: blendColor(
      containerColor,
      theme.colors.onSurface,
      PRESS_OPACITY,
    ),
  }
}

export function getResolvedCardColors(
  theme: MaterialTheme,
  variant: CardVariant,
  containerColor?: string,
): CardColors {
  return applyContainerColorOverride(
    theme,
    getVariantColors(theme, variant),
    containerColor,
  )
}

export function createStyles(
  theme: MaterialTheme,
  variant: CardVariant,
  containerColor?: string,
) {
  const colors = getResolvedCardColors(theme, variant, containerColor)
  const elevationLevel0 = elevationStyle(theme.elevation.level0)
  const elevationLevel1 = elevationStyle(theme.elevation.level1)
  const baseElevation =
    variant === 'elevated' ? elevationLevel1 : elevationLevel0

  const focusRingInset = -(CARD_FOCUS_RING_OFFSET + CARD_FOCUS_RING_WIDTH)

  return StyleSheet.create({
    wrapper: {
      borderRadius: theme.shape.cornerMedium,
    },
    container: {
      borderRadius: theme.shape.cornerMedium,
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
      borderWidth: colors.borderWidth,
      overflow: 'hidden',
      ...baseElevation,
    },
    interactiveContainer: {
      cursor: 'pointer',
    },
    focusRing: {
      position: 'absolute' as const,
      top: focusRingInset,
      left: focusRingInset,
      right: focusRingInset,
      bottom: focusRingInset,
      borderRadius: theme.shape.cornerMedium + CARD_FOCUS_RING_OFFSET,
      borderWidth: CARD_FOCUS_RING_WIDTH,
      borderColor: theme.colors.secondary,
    },
    // Disabled keeps the variant's rest elevation (MD3: elevated stays at
    // level1 when disabled, only content opacity drops to 38%). No elevation
    // override here — the base `container` style carries the right level.
    disabledContainer: {
      backgroundColor: colors.disabledBackgroundColor,
      borderColor: colors.disabledBorderColor,
      cursor: 'auto',
    },
    disabledContent: {
      opacity: theme.stateLayer.disabledOpacity,
    },
  })
}
