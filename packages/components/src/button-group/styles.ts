import type { MaterialTheme, TextStyle } from '@onlynative/core'
import { alphaColor, blendColor } from '@onlynative/utils'
import { StyleSheet } from 'react-native'
import type { ButtonGroupSize, ButtonGroupVariant } from './types'

export const BUTTON_GROUP_FOCUS_RING_OFFSET = 2
export const BUTTON_GROUP_FOCUS_RING_WIDTH = 3

// MD3 state-layer opacity tokens. ButtonGroup pins these to spec values rather
// than reading `theme.stateLayer.*` because the theme defaults drift from MD3
// (press = 0.12 vs spec 0.10). If the theme tokens are realigned with MD3
// later, swap these back to `theme.stateLayer.{hovered,focused,pressed}Opacity`.
const HOVER_OPACITY = 0.08
const FOCUS_OPACITY = 0.1
const PRESS_OPACITY = 0.1

// MD3 disabled-container opacity for filled-style buttons.
const DISABLED_CONTAINER_OPACITY = 0.12
const DISABLED_CONTENT_OPACITY = 0.38

interface SizeTokens {
  height: number
  paddingHorizontal: number
  iconSize: number
  selectedCorner: number
  iconGap: number
  labelStyleKey:
    | 'labelMedium'
    | 'labelLarge'
    | 'titleMedium'
    | 'titleLarge'
    | 'headlineSmall'
}

const SIZE_TOKENS: Record<ButtonGroupSize, SizeTokens> = {
  extraSmall: {
    height: 32,
    paddingHorizontal: 12,
    iconSize: 16,
    selectedCorner: 8,
    iconGap: 4,
    labelStyleKey: 'labelMedium',
  },
  small: {
    height: 40,
    paddingHorizontal: 16,
    iconSize: 18,
    selectedCorner: 12,
    iconGap: 8,
    labelStyleKey: 'labelLarge',
  },
  medium: {
    height: 56,
    paddingHorizontal: 24,
    iconSize: 24,
    selectedCorner: 16,
    iconGap: 8,
    labelStyleKey: 'titleMedium',
  },
  large: {
    height: 96,
    paddingHorizontal: 48,
    iconSize: 32,
    selectedCorner: 28,
    iconGap: 12,
    labelStyleKey: 'titleLarge',
  },
  extraLarge: {
    height: 136,
    paddingHorizontal: 64,
    iconSize: 40,
    selectedCorner: 32,
    iconGap: 16,
    labelStyleKey: 'headlineSmall',
  },
}

export function getSizeTokens(size: ButtonGroupSize): SizeTokens {
  return SIZE_TOKENS[size]
}

/** Gap (in dp) between items in the `standard` variant, and the visible
 * separator gap in the `connected` variant. */
export function getItemGap(
  theme: MaterialTheme,
  variant: ButtonGroupVariant,
): number {
  // MD3 expressive: 8dp between standard items, 2dp between connected items.
  if (variant === 'connected') return 2
  return theme.spacing.sm
}

export interface ItemColors {
  backgroundColor: string
  textColor: string
  hoveredBackgroundColor: string
  focusedBackgroundColor: string
  pressedBackgroundColor: string
  disabledBackgroundColor: string
  disabledTextColor: string
}

interface ResolveColorOptions {
  containerOverride?: string
  contentOverride?: string
}

function resolveItemColors(
  theme: MaterialTheme,
  baseBackground: string,
  baseText: string,
): ItemColors {
  return {
    backgroundColor: baseBackground,
    textColor: baseText,
    hoveredBackgroundColor: blendColor(baseBackground, baseText, HOVER_OPACITY),
    focusedBackgroundColor: blendColor(baseBackground, baseText, FOCUS_OPACITY),
    pressedBackgroundColor: blendColor(baseBackground, baseText, PRESS_OPACITY),
    disabledBackgroundColor: alphaColor(
      theme.colors.onSurface,
      DISABLED_CONTAINER_OPACITY,
    ),
    disabledTextColor: alphaColor(
      theme.colors.onSurface,
      DISABLED_CONTENT_OPACITY,
    ),
  }
}

function resolveSelectedColors(
  theme: MaterialTheme,
  options: ResolveColorOptions,
): ItemColors {
  return resolveItemColors(
    theme,
    options.containerOverride ?? theme.colors.primary,
    options.contentOverride ?? theme.colors.onPrimary,
  )
}

function resolveUnselectedColors(
  theme: MaterialTheme,
  options: ResolveColorOptions,
): ItemColors {
  return resolveItemColors(
    theme,
    options.containerOverride ?? theme.colors.secondaryContainer,
    options.contentOverride ?? theme.colors.onSecondaryContainer,
  )
}

export function getResolvedItemColors(
  theme: MaterialTheme,
  isSelected: boolean,
  containerColor?: string,
  contentColor?: string,
  selectedContainerColor?: string,
  selectedContentColor?: string,
): ItemColors {
  if (isSelected) {
    return resolveSelectedColors(theme, {
      containerOverride: selectedContainerColor,
      contentOverride: selectedContentColor,
    })
  }
  return resolveUnselectedColors(theme, {
    containerOverride: containerColor,
    contentOverride: contentColor,
  })
}

export interface ItemCornerRadii {
  topLeft: number
  topRight: number
  bottomLeft: number
  bottomRight: number
}

/**
 * Compute corner radii for an item given its position in the group, the
 * variant, and whether it is selected. In the `connected` variant, outer
 * edges of the first and last items keep the full pill radius while inner
 * edges square down. The selected item morphs all four corners to a
 * smaller "selected" radius defined by the size token.
 */
export function getItemCornerRadii(
  theme: MaterialTheme,
  variant: ButtonGroupVariant,
  size: ButtonGroupSize,
  index: number,
  total: number,
  isSelected: boolean,
): ItemCornerRadii {
  const tokens = getSizeTokens(size)
  const selectedRadius = tokens.selectedCorner

  if (variant === 'standard') {
    const radius = isSelected ? selectedRadius : theme.shape.cornerFull
    return {
      topLeft: radius,
      topRight: radius,
      bottomLeft: radius,
      bottomRight: radius,
    }
  }

  // connected
  const isFirst = index === 0
  const isLast = index === total - 1
  const innerRadius = theme.shape.cornerExtraSmall
  const outerRadius = theme.shape.cornerFull

  if (isSelected) {
    return {
      topLeft: selectedRadius,
      topRight: selectedRadius,
      bottomLeft: selectedRadius,
      bottomRight: selectedRadius,
    }
  }

  return {
    topLeft: isFirst ? outerRadius : innerRadius,
    bottomLeft: isFirst ? outerRadius : innerRadius,
    topRight: isLast ? outerRadius : innerRadius,
    bottomRight: isLast ? outerRadius : innerRadius,
  }
}

export function createGroupStyles(
  theme: MaterialTheme,
  variant: ButtonGroupVariant,
) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'stretch',
      alignSelf: 'flex-start',
      gap: getItemGap(theme, variant),
    },
  })
}

export function createItemStyles(
  theme: MaterialTheme,
  size: ButtonGroupSize,
  colors: ItemColors,
) {
  const tokens = getSizeTokens(size)
  const labelStyle: TextStyle = theme.typography[tokens.labelStyleKey]
  const focusRingInset = -(
    BUTTON_GROUP_FOCUS_RING_OFFSET + BUTTON_GROUP_FOCUS_RING_WIDTH
  )

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      minHeight: tokens.height,
      paddingHorizontal: tokens.paddingHorizontal,
      cursor: 'pointer',
    },
    disabledContainer: {
      backgroundColor: colors.disabledBackgroundColor,
      cursor: 'auto',
    },
    focusRing: {
      position: 'absolute' as const,
      top: focusRingInset,
      left: focusRingInset,
      right: focusRingInset,
      bottom: focusRingInset,
      borderWidth: BUTTON_GROUP_FOCUS_RING_WIDTH,
      borderColor: theme.colors.secondary,
    },
    label: {
      fontFamily: labelStyle.fontFamily,
      fontSize: labelStyle.fontSize,
      lineHeight: labelStyle.lineHeight,
      fontWeight: labelStyle.fontWeight,
      letterSpacing: labelStyle.letterSpacing,
      color: colors.textColor,
    },
    leadingIcon: {
      marginEnd: tokens.iconGap,
    },
    trailingIcon: {
      marginStart: tokens.iconGap,
    },
    disabledLabel: {
      color: colors.disabledTextColor,
    },
  })
}
