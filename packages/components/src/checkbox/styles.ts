import { StyleSheet } from 'react-native'
import type { MaterialTheme } from '@onlynative/core'

import { alphaColor, blendColor } from '../utils/color'

interface BoxColors {
  backgroundColor: string
  borderColor: string
  borderWidth: number
  iconColor: string
  hoveredBackgroundColor: string
  pressedBackgroundColor: string
  disabledBackgroundColor: string
  disabledBorderColor: string
  disabledBorderWidth: number
  disabledIconColor: string
}

function getColors(theme: MaterialTheme, checked: boolean): BoxColors {
  const disabledOnSurface38 = alphaColor(theme.colors.onSurface, 0.38)

  if (checked) {
    return {
      backgroundColor: theme.colors.primary,
      borderColor: 'transparent',
      borderWidth: 0,
      iconColor: theme.colors.onPrimary,
      hoveredBackgroundColor: blendColor(
        theme.colors.primary,
        theme.colors.onPrimary,
        theme.stateLayer.hoveredOpacity,
      ),
      pressedBackgroundColor: blendColor(
        theme.colors.primary,
        theme.colors.onPrimary,
        theme.stateLayer.pressedOpacity,
      ),
      disabledBackgroundColor: disabledOnSurface38,
      disabledBorderColor: 'transparent',
      disabledBorderWidth: 0,
      disabledIconColor: theme.colors.surface,
    }
  }

  return {
    backgroundColor: 'transparent',
    borderColor: theme.colors.onSurfaceVariant,
    borderWidth: 2,
    iconColor: 'transparent',
    hoveredBackgroundColor: alphaColor(
      theme.colors.onSurface,
      theme.stateLayer.hoveredOpacity,
    ),
    pressedBackgroundColor: alphaColor(
      theme.colors.onSurface,
      theme.stateLayer.pressedOpacity,
    ),
    disabledBackgroundColor: 'transparent',
    disabledBorderColor: disabledOnSurface38,
    disabledBorderWidth: 2,
    disabledIconColor: 'transparent',
  }
}

function applyColorOverrides(
  theme: MaterialTheme,
  colors: BoxColors,
  containerColor?: string,
  contentColor?: string,
): BoxColors {
  if (!containerColor && !contentColor) return colors

  const result = { ...colors }

  if (contentColor) {
    result.iconColor = contentColor
  }

  if (containerColor) {
    const overlay = contentColor ?? colors.iconColor
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
  }

  return result
}

export function createStyles(
  theme: MaterialTheme,
  checked: boolean,
  containerColor?: string,
  contentColor?: string,
) {
  const colors = applyColorOverrides(
    theme,
    getColors(theme, checked),
    containerColor,
    contentColor,
  )

  const size = 18
  const touchTarget = 48

  return StyleSheet.create({
    container: {
      width: touchTarget,
      height: touchTarget,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    hoveredContainer: {
      borderRadius: touchTarget / 2,
      backgroundColor: colors.hoveredBackgroundColor,
    },
    pressedContainer: {
      borderRadius: touchTarget / 2,
      backgroundColor: colors.pressedBackgroundColor,
    },
    disabledContainer: {
      cursor: 'auto',
    },
    box: {
      width: size,
      height: size,
      borderRadius: theme.shape.cornerExtraSmall,
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
      borderWidth: colors.borderWidth,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    disabledBox: {
      backgroundColor: colors.disabledBackgroundColor,
      borderColor: colors.disabledBorderColor,
      borderWidth: colors.disabledBorderWidth,
    },
    iconColor: {
      color: colors.iconColor,
    },
    disabledIconColor: {
      color: colors.disabledIconColor,
    },
  })
}
