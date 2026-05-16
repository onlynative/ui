import type { MaterialTheme } from '@onlynative/core'
import { alphaColor, blendColor, elevationStyle } from '@onlynative/utils'
import { StyleSheet } from 'react-native'
import type { FABSize, FABVariant } from './types'

export const FAB_FOCUS_RING_OFFSET = 2
export const FAB_FOCUS_RING_WIDTH = 3

// MD3 state-layer opacity tokens. FAB pins these to spec values rather than
// reading `theme.stateLayer.*` because the theme defaults drift from MD3
// (press = 0.12 vs spec 0.10). If the theme tokens are realigned with MD3
// later, swap these back to `theme.stateLayer.{hovered,focused,pressed}Opacity`.
const HOVER_OPACITY = 0.08
const FOCUS_OPACITY = 0.1
const PRESS_OPACITY = 0.1

// MD3 disabled-state opacities for FAB (matches the filled-button tokens).
const DISABLED_CONTAINER_OPACITY = 0.12
const DISABLED_CONTENT_OPACITY = 0.38

export interface FABColors {
  backgroundColor: string
  contentColor: string
  hoveredBackgroundColor: string
  focusedBackgroundColor: string
  pressedBackgroundColor: string
  disabledBackgroundColor: string
  disabledContentColor: string
}

function getVariantColors(
  theme: MaterialTheme,
  variant: FABVariant,
): { backgroundColor: string; contentColor: string } {
  if (variant === 'secondary') {
    return {
      backgroundColor: theme.colors.secondaryContainer,
      contentColor: theme.colors.onSecondaryContainer,
    }
  }

  if (variant === 'tertiary') {
    return {
      backgroundColor: theme.colors.tertiaryContainer,
      contentColor: theme.colors.onTertiaryContainer,
    }
  }

  if (variant === 'surface') {
    return {
      backgroundColor: theme.colors.surfaceContainerHigh,
      contentColor: theme.colors.primary,
    }
  }

  return {
    backgroundColor: theme.colors.primaryContainer,
    contentColor: theme.colors.onPrimaryContainer,
  }
}

function deriveStateLayers(
  backgroundColor: string,
  overlay: string,
): {
  hoveredBackgroundColor: string
  focusedBackgroundColor: string
  pressedBackgroundColor: string
} {
  return {
    hoveredBackgroundColor: blendColor(backgroundColor, overlay, HOVER_OPACITY),
    focusedBackgroundColor: blendColor(backgroundColor, overlay, FOCUS_OPACITY),
    pressedBackgroundColor: blendColor(backgroundColor, overlay, PRESS_OPACITY),
  }
}

export function getResolvedFABColors(
  theme: MaterialTheme,
  variant: FABVariant,
  containerColorOverride?: string,
  contentColorOverride?: string,
): FABColors {
  const variantColors = getVariantColors(theme, variant)
  const backgroundColor =
    containerColorOverride ?? variantColors.backgroundColor
  const contentColor = contentColorOverride ?? variantColors.contentColor

  return {
    backgroundColor,
    contentColor,
    ...deriveStateLayers(backgroundColor, contentColor),
    disabledBackgroundColor: alphaColor(
      theme.colors.onSurface,
      DISABLED_CONTAINER_OPACITY,
    ),
    disabledContentColor: alphaColor(
      theme.colors.onSurface,
      DISABLED_CONTENT_OPACITY,
    ),
  }
}

export function getFABSizeStyle(
  styles: ReturnType<typeof createStyles>,
  size: FABSize,
) {
  if (size === 'small') return styles.sizeSmall
  if (size === 'large') return styles.sizeLarge
  return styles.sizeMedium
}

export function getFABIconPixelSize(size: FABSize): number {
  if (size === 'large') return 36
  return 24
}

export function createStyles(theme: MaterialTheme) {
  const focusRingInset = -(FAB_FOCUS_RING_OFFSET + FAB_FOCUS_RING_WIDTH)
  const restingElevation = elevationStyle(theme.elevation.level3)
  const labelStyle = theme.typography.labelLarge

  return StyleSheet.create({
    wrapper: {
      alignSelf: 'flex-start' as const,
    },
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      ...restingElevation,
    },
    sizeSmall: {
      width: 40,
      height: 40,
      borderRadius: theme.shape.cornerMedium,
    },
    sizeMedium: {
      width: 56,
      height: 56,
      borderRadius: theme.shape.cornerLarge,
    },
    sizeLarge: {
      width: 96,
      height: 96,
      borderRadius: theme.shape.cornerExtraLarge,
    },
    extended: {
      flexDirection: 'row',
      height: 56,
      minWidth: 80,
      // MD3 spec: 20dp horizontal padding (no token in theme.spacing).
      paddingHorizontal: 20,
      borderRadius: theme.shape.cornerLarge,
    },
    extendedWithIcon: {
      // MD3 spec: 16dp icon-side, 20dp text-side.
      paddingStart: theme.spacing.md,
      paddingEnd: 20,
    },
    extendedIcon: {
      marginEnd: theme.spacing.sm + theme.spacing.xs,
    },
    label: {
      fontFamily: labelStyle.fontFamily,
      fontSize: labelStyle.fontSize,
      lineHeight: labelStyle.lineHeight,
      fontWeight: labelStyle.fontWeight,
      letterSpacing: labelStyle.letterSpacing,
    },
    disabled: {
      cursor: 'auto',
    },
    focusRing: {
      position: 'absolute' as const,
      top: focusRingInset,
      left: focusRingInset,
      right: focusRingInset,
      bottom: focusRingInset,
      borderWidth: FAB_FOCUS_RING_WIDTH,
      borderColor: theme.colors.secondary,
    },
    focusRingSmall: {
      borderRadius: theme.shape.cornerMedium + FAB_FOCUS_RING_OFFSET,
    },
    focusRingMedium: {
      borderRadius: theme.shape.cornerLarge + FAB_FOCUS_RING_OFFSET,
    },
    focusRingLarge: {
      borderRadius: theme.shape.cornerExtraLarge + FAB_FOCUS_RING_OFFSET,
    },
  })
}
