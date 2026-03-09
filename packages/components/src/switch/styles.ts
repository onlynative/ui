import { StyleSheet } from 'react-native'
import type { MaterialTheme } from '@onlynative/core'

import { alphaColor, blendColor } from '@onlynative/utils'

interface TrackColors {
  trackColor: string
  thumbColor: string
  iconColor: string
  hoveredTrackColor: string
  pressedTrackColor: string
  borderColor: string
  borderWidth: number
  disabledTrackColor: string
  disabledThumbColor: string
  disabledBorderColor: string
  disabledBorderWidth: number
}

function getColors(theme: MaterialTheme, selected: boolean): TrackColors {
  const disabledOnSurface12 = alphaColor(theme.colors.onSurface, 0.12)
  const disabledOnSurface38 = alphaColor(theme.colors.onSurface, 0.38)

  if (selected) {
    return {
      trackColor: theme.colors.primary,
      thumbColor: theme.colors.onPrimary,
      iconColor: theme.colors.onPrimaryContainer,
      hoveredTrackColor: blendColor(
        theme.colors.primary,
        theme.colors.onPrimary,
        theme.stateLayer.hoveredOpacity,
      ),
      pressedTrackColor: blendColor(
        theme.colors.primary,
        theme.colors.onPrimary,
        theme.stateLayer.pressedOpacity,
      ),
      borderColor: 'transparent',
      borderWidth: 0,
      disabledTrackColor: disabledOnSurface12,
      disabledThumbColor: theme.colors.surface,
      disabledBorderColor: 'transparent',
      disabledBorderWidth: 0,
    }
  }

  return {
    trackColor: theme.colors.surfaceContainerHighest,
    thumbColor: theme.colors.outline,
    iconColor: theme.colors.surfaceContainerHighest,
    hoveredTrackColor: blendColor(
      theme.colors.surfaceContainerHighest,
      theme.colors.onSurface,
      theme.stateLayer.hoveredOpacity,
    ),
    pressedTrackColor: blendColor(
      theme.colors.surfaceContainerHighest,
      theme.colors.onSurface,
      theme.stateLayer.pressedOpacity,
    ),
    borderColor: theme.colors.outline,
    borderWidth: 2,
    disabledTrackColor: disabledOnSurface12,
    disabledThumbColor: disabledOnSurface38,
    disabledBorderColor: disabledOnSurface12,
    disabledBorderWidth: 2,
  }
}

function applyColorOverrides(
  theme: MaterialTheme,
  colors: TrackColors,
  containerColor?: string,
  contentColor?: string,
): TrackColors {
  if (!containerColor && !contentColor) return colors

  const result = { ...colors }

  if (contentColor) {
    result.thumbColor = contentColor
    result.iconColor = contentColor
  }

  if (containerColor) {
    const overlay = contentColor ?? colors.thumbColor
    result.trackColor = containerColor
    result.borderColor = containerColor
    result.hoveredTrackColor = blendColor(
      containerColor,
      overlay,
      theme.stateLayer.hoveredOpacity,
    )
    result.pressedTrackColor = blendColor(
      containerColor,
      overlay,
      theme.stateLayer.pressedOpacity,
    )
    if (contentColor) {
      result.iconColor = containerColor
    }
  }

  return result
}

export function createStyles(
  theme: MaterialTheme,
  selected: boolean,
  hasIcon: boolean,
  containerColor?: string,
  contentColor?: string,
) {
  const colors = applyColorOverrides(
    theme,
    getColors(theme, selected),
    containerColor,
    contentColor,
  )

  const thumbSize = selected || hasIcon ? 24 : 16
  const trackWidth = 52
  const trackHeight = 32
  const trackPadding = 4
  const thumbOffset = selected
    ? trackWidth - trackPadding - thumbSize
    : trackPadding

  return StyleSheet.create({
    track: {
      width: trackWidth,
      height: trackHeight,
      borderRadius: trackHeight / 2,
      backgroundColor: colors.trackColor,
      borderColor: colors.borderColor,
      borderWidth: colors.borderWidth,
      justifyContent: 'center',
      cursor: 'pointer',
    },
    hoveredTrack: {
      backgroundColor: colors.hoveredTrackColor,
    },
    pressedTrack: {
      backgroundColor: colors.pressedTrackColor,
    },
    disabledTrack: {
      backgroundColor: colors.disabledTrackColor,
      borderColor: colors.disabledBorderColor,
      borderWidth: colors.disabledBorderWidth,
      cursor: 'auto',
    },
    thumb: {
      width: thumbSize,
      height: thumbSize,
      borderRadius: thumbSize / 2,
      backgroundColor: colors.thumbColor,
      marginStart: thumbOffset,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    disabledThumb: {
      backgroundColor: colors.disabledThumbColor,
    },
    iconColor: {
      color: colors.iconColor,
    },
    disabledIconColor: {
      color: alphaColor(theme.colors.onSurface, 0.38),
    },
  })
}
