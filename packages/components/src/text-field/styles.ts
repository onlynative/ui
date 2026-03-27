import type { MaterialTheme } from '@onlynative/core'
import { alphaColor, transformOrigin } from '@onlynative/utils'
import { StyleSheet } from 'react-native'
import type { TextFieldVariant } from './types'

const CONTAINER_HEIGHT = 56
const ICON_SIZE = 24
const LABEL_FLOATED_LINE_HEIGHT = 16

// Filled: label floated 8dp from top, input at 24dp (8 + 16 label height), 8dp bottom.
// Label resting = vertically centered = (56 - 24) / 2 = 16dp from top.
const FILLED_LABEL_RESTING_TOP = 16
const FILLED_LABEL_FLOATED_TOP = 8
const FILLED_INPUT_TOP = 24 // 8dp label top + 16dp label line-height
const FILLED_INPUT_BOTTOM = 8

// Outlined: input centered 16dp top/bottom. Label resting = same 16dp.
// Label floated = centered on the border = -(lineHeight / 2).
const OUTLINED_INPUT_VERTICAL = 16
const OUTLINED_LABEL_RESTING_TOP = 16
const OUTLINED_LABEL_FLOATED_TOP = -(LABEL_FLOATED_LINE_HEIGHT / 2) // -8

export const labelPositions = {
  filledRestingTop: FILLED_LABEL_RESTING_TOP,
  filledFloatedTop: FILLED_LABEL_FLOATED_TOP,
  outlinedRestingTop: OUTLINED_LABEL_RESTING_TOP,
  outlinedFloatedTop: OUTLINED_LABEL_FLOATED_TOP,
} as const

interface VariantColors {
  backgroundColor: string
  borderColor: string
  focusedBorderColor: string
  errorBorderColor: string
  disabledBorderColor: string
  disabledBackgroundColor: string
  labelColor: string
  focusedLabelColor: string
  errorLabelColor: string
  disabledLabelColor: string
  textColor: string
  disabledTextColor: string
  placeholderColor: string
  supportingTextColor: string
  errorSupportingTextColor: string
  iconColor: string
  errorIconColor: string
  disabledIconColor: string
}

function getVariantColors(
  theme: MaterialTheme,
  variant: TextFieldVariant,
): VariantColors {
  const disabledOpacity = theme.stateLayer.disabledOpacity

  const common = {
    focusedBorderColor: theme.colors.primary,
    errorBorderColor: theme.colors.error,
    focusedLabelColor: theme.colors.primary,
    errorLabelColor: theme.colors.error,
    textColor: theme.colors.onSurface,
    disabledTextColor: alphaColor(theme.colors.onSurface, disabledOpacity),
    disabledLabelColor: alphaColor(theme.colors.onSurface, disabledOpacity),
    disabledBorderColor: alphaColor(theme.colors.onSurface, 0.12),
    placeholderColor: theme.colors.onSurfaceVariant,
    supportingTextColor: theme.colors.onSurfaceVariant,
    errorSupportingTextColor: theme.colors.error,
    iconColor: theme.colors.onSurfaceVariant,
    errorIconColor: theme.colors.error,
    disabledIconColor: alphaColor(theme.colors.onSurface, disabledOpacity),
  }

  if (variant === 'outlined') {
    return {
      ...common,
      backgroundColor: 'transparent',
      borderColor: theme.colors.outline,
      disabledBackgroundColor: 'transparent',
      labelColor: theme.colors.onSurfaceVariant,
    }
  }

  return {
    ...common,
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderColor: theme.colors.onSurfaceVariant,
    disabledBackgroundColor: alphaColor(theme.colors.onSurface, 0.04),
    labelColor: theme.colors.onSurfaceVariant,
  }
}

export function createStyles(theme: MaterialTheme, variant: TextFieldVariant) {
  const colors = getVariantColors(theme, variant)
  const bodyLarge = theme.typography.bodyLarge
  const bodySmall = theme.typography.bodySmall
  const isFilled = variant === 'filled'

  return {
    colors,
    styles: StyleSheet.create({
      root: {
        alignSelf: 'stretch',
      },
      container: {
        minHeight: CONTAINER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'stretch',
        backgroundColor: colors.backgroundColor,
        paddingHorizontal: theme.spacing.md,
        ...(isFilled
          ? {
              borderTopStartRadius: theme.shape.cornerExtraSmall,
              borderTopEndRadius: theme.shape.cornerExtraSmall,
            }
          : {
              borderRadius: theme.shape.cornerExtraSmall,
              borderWidth: 1,
              borderColor: colors.borderColor,
            }),
      },
      containerFocused: isFilled
        ? {}
        : {
            borderWidth: 2,
            borderColor: colors.focusedBorderColor,
            paddingHorizontal: theme.spacing.md - 1,
          },
      containerError: isFilled
        ? {}
        : {
            borderWidth: 2,
            borderColor: colors.errorBorderColor,
            paddingHorizontal: theme.spacing.md - 1,
          },
      containerDisabled: isFilled
        ? { backgroundColor: colors.disabledBackgroundColor }
        : {
            borderColor: colors.disabledBorderColor,
          },
      indicator: {
        position: 'absolute',
        start: 0,
        end: 0,
        bottom: 0,
        height: 1,
        backgroundColor: colors.borderColor,
      },
      indicatorFocused: {
        height: 2,
        backgroundColor: colors.focusedBorderColor,
      },
      indicatorError: {
        height: 2,
        backgroundColor: colors.errorBorderColor,
      },
      indicatorDisabled: {
        backgroundColor: colors.disabledBorderColor,
      },
      inputWrapper: {
        flex: 1,
        justifyContent: 'center',
      },
      // When label is present, use explicit padding so the input position
      // matches the label resting top exactly.
      inputWrapperWithLabel: {
        justifyContent: 'flex-start',
        paddingTop: isFilled ? FILLED_INPUT_TOP : OUTLINED_INPUT_VERTICAL,
        paddingBottom: isFilled ? FILLED_INPUT_BOTTOM : OUTLINED_INPUT_VERTICAL,
      },
      label: {
        position: 'absolute',
        zIndex: 1,
        fontFamily: bodySmall.fontFamily,
        fontSize: bodySmall.fontSize,
        lineHeight: bodySmall.lineHeight,
        fontWeight: bodySmall.fontWeight,
        letterSpacing: bodySmall.letterSpacing,
        color: colors.labelColor,
        transformOrigin: transformOrigin('top'),
      },
      labelNotch: {
        paddingHorizontal: 4,
      },
      input: {
        fontFamily: bodyLarge.fontFamily,
        fontSize: bodyLarge.fontSize,
        lineHeight: bodyLarge.lineHeight,
        fontWeight: bodyLarge.fontWeight,
        letterSpacing: bodyLarge.letterSpacing,
        color: colors.textColor,
        paddingVertical: 0,
        paddingHorizontal: 0,
        margin: 0,
        includeFontPadding: false,
      },
      inputDisabled: {
        color: colors.disabledTextColor,
      },
      leadingIcon: {
        alignSelf: 'center',
        marginStart: -4, // 16dp container padding → 12dp icon inset per M3
        marginEnd: theme.spacing.md,
        width: ICON_SIZE,
        height: ICON_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
      },
      trailingIcon: {
        alignSelf: 'center',
        marginStart: theme.spacing.md,
        marginEnd: -4, // 16dp container padding → 12dp icon inset per M3
        width: ICON_SIZE,
        height: ICON_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
      },
      trailingIconPressable: {
        alignSelf: 'center',
      },
      supportingTextRow: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.xs,
      },
      supportingText: {
        fontFamily: bodySmall.fontFamily,
        fontSize: bodySmall.fontSize,
        lineHeight: bodySmall.lineHeight,
        fontWeight: bodySmall.fontWeight,
        letterSpacing: bodySmall.letterSpacing,
        color: colors.supportingTextColor,
      },
      errorSupportingText: {
        color: colors.errorSupportingTextColor,
      },
    }),
  }
}
