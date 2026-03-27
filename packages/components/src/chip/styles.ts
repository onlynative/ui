import type { MaterialTheme } from '@onlynative/core'
import { alphaColor, blendColor, elevationStyle } from '@onlynative/utils'
import { StyleSheet } from 'react-native'
import type { ChipVariant } from './types'

interface VariantColors {
  backgroundColor: string
  textColor: string
  borderColor: string
  borderWidth: number
  hoveredBackgroundColor: string
  pressedBackgroundColor: string
  disabledBackgroundColor: string
  disabledTextColor: string
  disabledBorderColor: string
}

function getVariantColors(
  theme: MaterialTheme,
  variant: ChipVariant,
  elevated: boolean,
  selected: boolean,
): VariantColors {
  const disabledContainerColor = alphaColor(theme.colors.onSurface, 0.12)
  const disabledLabelColor = alphaColor(theme.colors.onSurface, 0.38)
  const disabledOutlineColor = alphaColor(theme.colors.onSurface, 0.12)

  // Filter chip — selected state
  if (variant === 'filter' && selected) {
    return {
      backgroundColor: theme.colors.secondaryContainer,
      textColor: theme.colors.onSecondaryContainer,
      borderColor: 'transparent',
      borderWidth: 0,
      hoveredBackgroundColor: blendColor(
        theme.colors.secondaryContainer,
        theme.colors.onSecondaryContainer,
        theme.stateLayer.hoveredOpacity,
      ),
      pressedBackgroundColor: blendColor(
        theme.colors.secondaryContainer,
        theme.colors.onSecondaryContainer,
        theme.stateLayer.pressedOpacity,
      ),
      disabledBackgroundColor: disabledContainerColor,
      disabledTextColor: disabledLabelColor,
      disabledBorderColor: 'transparent',
    }
  }

  // Elevated variants (assist, filter unselected, suggestion)
  // Input variant ignores elevated — always outlined
  if (elevated && variant !== 'input') {
    const textColor =
      variant === 'assist'
        ? theme.colors.onSurface
        : theme.colors.onSurfaceVariant
    return {
      backgroundColor: theme.colors.surfaceContainerLow,
      textColor,
      borderColor: 'transparent',
      borderWidth: 0,
      hoveredBackgroundColor: blendColor(
        theme.colors.surfaceContainerLow,
        textColor,
        theme.stateLayer.hoveredOpacity,
      ),
      pressedBackgroundColor: blendColor(
        theme.colors.surfaceContainerLow,
        textColor,
        theme.stateLayer.pressedOpacity,
      ),
      disabledBackgroundColor: disabledContainerColor,
      disabledTextColor: disabledLabelColor,
      disabledBorderColor: 'transparent',
    }
  }

  // Flat (outlined) variants
  const textColor =
    variant === 'assist'
      ? theme.colors.onSurface
      : theme.colors.onSurfaceVariant

  return {
    backgroundColor: theme.colors.surface,
    textColor,
    borderColor: theme.colors.outline,
    borderWidth: 1,
    hoveredBackgroundColor: blendColor(
      theme.colors.surface,
      textColor,
      theme.stateLayer.hoveredOpacity,
    ),
    pressedBackgroundColor: blendColor(
      theme.colors.surface,
      textColor,
      theme.stateLayer.pressedOpacity,
    ),
    disabledBackgroundColor: disabledContainerColor,
    disabledTextColor: disabledLabelColor,
    disabledBorderColor: disabledOutlineColor,
  }
}

function applyColorOverrides(
  theme: MaterialTheme,
  colors: VariantColors,
  containerColor?: string,
  contentColor?: string,
): VariantColors {
  if (!containerColor && !contentColor) return colors

  const result = { ...colors }

  if (contentColor) {
    result.textColor = contentColor
  }

  if (containerColor) {
    const overlay = contentColor ?? colors.textColor
    result.backgroundColor = containerColor
    result.borderColor = containerColor
    result.hoveredBackgroundColor = blendColor(
      containerColor,
      overlay,
      theme.stateLayer.hoveredOpacity,
    )
    result.pressedBackgroundColor = blendColor(
      containerColor,
      overlay,
      theme.stateLayer.pressedOpacity,
    )
  } else if (contentColor) {
    if (colors.backgroundColor === 'transparent') {
      result.hoveredBackgroundColor = alphaColor(
        contentColor,
        theme.stateLayer.hoveredOpacity,
      )
      result.pressedBackgroundColor = alphaColor(
        contentColor,
        theme.stateLayer.pressedOpacity,
      )
    } else {
      result.hoveredBackgroundColor = blendColor(
        colors.backgroundColor,
        contentColor,
        theme.stateLayer.hoveredOpacity,
      )
      result.pressedBackgroundColor = blendColor(
        colors.backgroundColor,
        contentColor,
        theme.stateLayer.pressedOpacity,
      )
    }
  }

  return result
}

export function createStyles(
  theme: MaterialTheme,
  variant: ChipVariant,
  elevated: boolean,
  selected: boolean,
  hasLeadingContent: boolean,
  hasTrailingContent: boolean,
  containerColor?: string,
  contentColor?: string,
) {
  const baseColors = getVariantColors(theme, variant, elevated, selected)
  const colors = applyColorOverrides(
    theme,
    baseColors,
    containerColor,
    contentColor,
  )
  const labelStyle = theme.typography.labelLarge
  const elevationLevel0 = elevationStyle(theme.elevation.level0)
  const elevationLevel1 = elevationStyle(theme.elevation.level1)
  const elevationLevel2 = elevationStyle(theme.elevation.level2)
  const isElevated = elevated && variant !== 'input'
  const baseElevation = isElevated ? elevationLevel1 : elevationLevel0

  return StyleSheet.create({
    container: {
      alignSelf: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      height: 32,
      paddingStart: hasLeadingContent ? 8 : 16,
      paddingEnd: hasTrailingContent ? 8 : 16,
      borderRadius: theme.shape.cornerSmall,
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
      borderWidth: colors.borderWidth,
      cursor: 'pointer',
      ...baseElevation,
    },
    hoveredContainer: {
      backgroundColor: colors.hoveredBackgroundColor,
      ...(isElevated ? elevationLevel2 : undefined),
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
    label: {
      fontFamily: labelStyle.fontFamily,
      fontSize: labelStyle.fontSize,
      lineHeight: labelStyle.lineHeight,
      fontWeight: labelStyle.fontWeight,
      letterSpacing: labelStyle.letterSpacing,
      color: colors.textColor,
    },
    disabledLabel: {
      color: colors.disabledTextColor,
    },
    leadingIcon: {
      marginEnd: theme.spacing.sm,
    },
    avatar: {
      marginEnd: theme.spacing.sm,
      width: 24,
      height: 24,
      borderRadius: 12,
      overflow: 'hidden' as const,
    },
    closeButton: {
      marginStart: theme.spacing.sm,
    },
  })
}
