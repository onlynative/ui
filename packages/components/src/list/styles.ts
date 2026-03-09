import { StyleSheet } from 'react-native'
import type { MaterialTheme } from '@onlynative/core'

import type { ListItemLines } from './types'
import { alphaColor, blendColor } from '@onlynative/utils'

const ITEM_PADDING_VERTICAL = 12
const INSET_START = 56

const MIN_HEIGHT: Record<ListItemLines, number> = {
  1: 56,
  2: 72,
  3: 88,
}

export function createListStyles(theme: MaterialTheme) {
  return StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.sm,
    },
  })
}

interface ItemColors {
  backgroundColor: string
  hoveredBackgroundColor: string
  pressedBackgroundColor: string
}

function getItemColors(theme: MaterialTheme, containerColor?: string): ItemColors {
  const base = containerColor ?? 'transparent'

  if (containerColor) {
    return {
      backgroundColor: containerColor,
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

  return {
    backgroundColor: base,
    hoveredBackgroundColor: alphaColor(
      theme.colors.onSurface,
      theme.stateLayer.hoveredOpacity,
    ),
    pressedBackgroundColor: alphaColor(
      theme.colors.onSurface,
      theme.stateLayer.pressedOpacity,
    ),
  }
}

export function createListItemStyles(
  theme: MaterialTheme,
  lines: ListItemLines,
  containerColor?: string,
) {
  const colors = getItemColors(theme, containerColor)

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: lines === 3 ? 'flex-start' : 'center',
      minHeight: MIN_HEIGHT[lines],
      paddingHorizontal: theme.spacing.md,
      paddingVertical: ITEM_PADDING_VERTICAL,
      backgroundColor: colors.backgroundColor,
    },
    interactiveContainer: {
      cursor: 'pointer',
    },
    hoveredContainer: {
      backgroundColor: colors.hoveredBackgroundColor,
    },
    pressedContainer: {
      backgroundColor: colors.pressedBackgroundColor,
    },
    disabledContainer: {
      cursor: 'auto',
    },
    disabledContentWrapper: {
      flexDirection: 'row',
      flex: 1,
      opacity: theme.stateLayer.disabledOpacity,
    },
    leadingContent: {
      marginEnd: theme.spacing.md,
    },
    textBlock: {
      flex: 1,
    },
    overlineText: {
      ...theme.typography.labelSmall,
      color: theme.colors.onSurfaceVariant,
    },
    headlineText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.onSurface,
    },
    supportingText: {
      ...theme.typography.bodyMedium,
      color: theme.colors.onSurfaceVariant,
    },
    trailingBlock: {
      marginStart: theme.spacing.md,
      alignItems: 'flex-end',
    },
    trailingSupportingText: {
      ...theme.typography.labelSmall,
      color: theme.colors.onSurfaceVariant,
    },
  })
}

export function createDividerStyles(theme: MaterialTheme, inset: boolean) {
  return StyleSheet.create({
    divider: {
      height: 1,
      backgroundColor: theme.colors.outlineVariant,
      ...(inset ? { marginStart: INSET_START } : undefined),
    },
  })
}
