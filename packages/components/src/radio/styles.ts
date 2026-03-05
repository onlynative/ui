import { StyleSheet } from 'react-native'
import type { MaterialTheme } from '@onlynative/core'

import { alphaColor } from '../utils/color'

interface RadioColors {
  borderColor: string
  dotColor: string
  hoveredBackgroundColor: string
  pressedBackgroundColor: string
  disabledBorderColor: string
  disabledDotColor: string
}

function getColors(theme: MaterialTheme, selected: boolean): RadioColors {
  const disabledOnSurface38 = alphaColor(theme.colors.onSurface, 0.38)

  if (selected) {
    return {
      borderColor: theme.colors.primary,
      dotColor: theme.colors.primary,
      hoveredBackgroundColor: alphaColor(
        theme.colors.primary,
        theme.stateLayer.hoveredOpacity,
      ),
      pressedBackgroundColor: alphaColor(
        theme.colors.primary,
        theme.stateLayer.pressedOpacity,
      ),
      disabledBorderColor: disabledOnSurface38,
      disabledDotColor: disabledOnSurface38,
    }
  }

  return {
    borderColor: theme.colors.onSurfaceVariant,
    dotColor: 'transparent',
    hoveredBackgroundColor: alphaColor(
      theme.colors.onSurface,
      theme.stateLayer.hoveredOpacity,
    ),
    pressedBackgroundColor: alphaColor(
      theme.colors.onSurface,
      theme.stateLayer.pressedOpacity,
    ),
    disabledBorderColor: disabledOnSurface38,
    disabledDotColor: 'transparent',
  }
}

function applyColorOverrides(
  theme: MaterialTheme,
  colors: RadioColors,
  containerColor?: string,
  contentColor?: string,
): RadioColors {
  if (!containerColor && !contentColor) return colors

  const result = { ...colors }

  if (containerColor) {
    result.borderColor = containerColor
    result.dotColor = containerColor
    result.hoveredBackgroundColor = alphaColor(
      containerColor,
      theme.stateLayer.hoveredOpacity,
    )
    result.pressedBackgroundColor = alphaColor(
      containerColor,
      theme.stateLayer.pressedOpacity,
    )
  }

  if (contentColor) {
    result.borderColor = contentColor
  }

  return result
}

export function createStyles(
  theme: MaterialTheme,
  selected: boolean,
  containerColor?: string,
  contentColor?: string,
) {
  const colors = applyColorOverrides(
    theme,
    getColors(theme, selected),
    containerColor,
    contentColor,
  )

  const outerSize = 20
  const innerSize = 10
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
    outer: {
      width: outerSize,
      height: outerSize,
      borderRadius: outerSize / 2,
      borderWidth: 2,
      borderColor: colors.borderColor,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    disabledOuter: {
      borderColor: colors.disabledBorderColor,
    },
    inner: {
      width: innerSize,
      height: innerSize,
      borderRadius: innerSize / 2,
      backgroundColor: colors.dotColor,
    },
    disabledInner: {
      backgroundColor: colors.disabledDotColor,
    },
  })
}
