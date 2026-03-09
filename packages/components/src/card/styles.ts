import { StyleSheet } from 'react-native'
import type { MaterialTheme } from '@onlynative/core'

import type { CardVariant } from './types'
import { alphaColor, blendColor, elevationStyle } from '@onlynative/utils'

interface VariantColors {
  backgroundColor: string
  borderColor: string
  borderWidth: number
  hoveredBackgroundColor: string
  pressedBackgroundColor: string
  disabledBackgroundColor: string
  disabledBorderColor: string
}

function getVariantColors(theme: MaterialTheme, variant: CardVariant): VariantColors {
  const disabledContainerColor = alphaColor(theme.colors.onSurface, 0.12)
  const disabledOutlineColor = alphaColor(theme.colors.onSurface, 0.12)

  if (variant === 'outlined') {
    return {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
      borderWidth: 1,
      hoveredBackgroundColor: alphaColor(
        theme.colors.onSurface,
        theme.stateLayer.hoveredOpacity,
      ),
      pressedBackgroundColor: alphaColor(
        theme.colors.onSurface,
        theme.stateLayer.pressedOpacity,
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
        theme.stateLayer.hoveredOpacity,
      ),
      pressedBackgroundColor: blendColor(
        theme.colors.surfaceContainerHighest,
        theme.colors.onSurface,
        theme.stateLayer.pressedOpacity,
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
      theme.stateLayer.hoveredOpacity,
    ),
    pressedBackgroundColor: blendColor(
      theme.colors.surface,
      theme.colors.onSurface,
      theme.stateLayer.pressedOpacity,
    ),
    disabledBackgroundColor: disabledContainerColor,
    disabledBorderColor: 'transparent',
  }
}

function applyColorOverrides(
  theme: MaterialTheme,
  colors: VariantColors,
  containerColor?: string,
): VariantColors {
  if (!containerColor) return colors

  return {
    ...colors,
    backgroundColor: containerColor,
    borderColor: containerColor,
    borderWidth: 0,
    hoveredBackgroundColor: blendColor(
      containerColor,
      theme.colors.onSurface,
      theme.stateLayer.hoveredOpacity,
    ),
    pressedBackgroundColor: blendColor(
      containerColor,
      theme.colors.onSurface,
      theme.stateLayer.pressedOpacity,
    ),
  }
}

export function createStyles(
  theme: MaterialTheme,
  variant: CardVariant,
  containerColor?: string,
) {
  const baseColors = getVariantColors(theme, variant)
  const colors = applyColorOverrides(theme, baseColors, containerColor)
  const elevationLevel0 = elevationStyle(theme.elevation.level0)
  const elevationLevel1 = elevationStyle(theme.elevation.level1)
  const elevationLevel2 = elevationStyle(theme.elevation.level2)
  const baseElevation =
    variant === 'elevated' ? elevationLevel1 : elevationLevel0

  return StyleSheet.create({
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
    hoveredContainer: {
      backgroundColor: colors.hoveredBackgroundColor,
      ...(variant === 'elevated'
        ? elevationLevel2
        : variant === 'filled'
          ? elevationLevel1
          : undefined),
    },
    pressedContainer: {
      backgroundColor: colors.pressedBackgroundColor,
    },
    disabledContainer: {
      backgroundColor: colors.disabledBackgroundColor,
      borderColor: colors.disabledBorderColor,
      cursor: 'auto',
      ...elevationLevel0,
    },
    disabledContent: {
      opacity: theme.stateLayer.disabledOpacity,
    },
  })
}
