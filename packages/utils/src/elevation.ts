import { Platform } from 'react-native'
import type { ViewStyle } from 'react-native'
import type { ElevationLevel } from '@onlynative/core'

/**
 * Converts a theme elevation level into platform-appropriate shadow styles.
 * - Native: uses shadow* props + elevation
 * - Web: uses boxShadow string
 */
export function elevationStyle(level: ElevationLevel): ViewStyle {
  if (Platform.OS === 'web') {
    const { shadowOffset, shadowOpacity, shadowRadius } = level

    if (shadowOpacity === 0) {
      return { boxShadow: 'none' } as ViewStyle
    }

    return {
      boxShadow: `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(0, 0, 0, ${shadowOpacity})`,
    } as ViewStyle
  }

  return {
    shadowColor: level.shadowColor,
    shadowOffset: {
      width: level.shadowOffset.width,
      height: level.shadowOffset.height,
    },
    shadowOpacity: level.shadowOpacity,
    shadowRadius: level.shadowRadius,
    elevation: level.elevation,
  }
}
