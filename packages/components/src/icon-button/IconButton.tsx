import { useIconResolver, useTheme } from '@onlynative/core'
import { alphaColor, blendColor, renderIcon } from '@onlynative/utils'
import { useMemo } from 'react'
import { Pressable } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { createStyles } from './styles'
import type {
  IconButtonProps,
  IconButtonSize,
  IconButtonVariant,
} from './types'

function getIconColor(
  variant: IconButtonVariant,
  theme: ReturnType<typeof useTheme>,
  disabled: boolean,
  isToggle: boolean,
  selected: boolean,
): string {
  if (disabled) {
    return alphaColor(theme.colors.onSurface, 0.38)
  }

  if (isToggle) {
    if (variant === 'filled') {
      return selected ? theme.colors.onPrimary : theme.colors.primary
    }

    if (variant === 'tonal') {
      return selected
        ? theme.colors.onSecondaryContainer
        : theme.colors.onSurfaceVariant
    }

    if (variant === 'outlined') {
      return selected
        ? theme.colors.inverseOnSurface
        : theme.colors.onSurfaceVariant
    }

    return selected ? theme.colors.primary : theme.colors.onSurfaceVariant
  }

  if (variant === 'filled') {
    return theme.colors.onPrimary
  }

  if (variant === 'tonal') {
    return theme.colors.onSecondaryContainer
  }

  return theme.colors.onSurfaceVariant
}

function getColorStyle(
  styles: ReturnType<typeof createStyles>,
  variant: IconButtonVariant,
  isToggle: boolean,
  selected: boolean,
) {
  if (isToggle) {
    if (variant === 'tonal') {
      return selected
        ? styles.colorTonalToggleSelected
        : styles.colorTonalToggleUnselected
    }

    if (variant === 'outlined') {
      return selected
        ? styles.colorOutlinedToggleSelected
        : styles.colorOutlined
    }

    if (variant === 'standard') {
      return selected
        ? styles.colorStandardToggleSelected
        : styles.colorStandard
    }

    return selected
      ? styles.colorFilledToggleSelected
      : styles.colorFilledToggleUnselected
  }

  if (variant === 'tonal') {
    return styles.colorTonal
  }

  if (variant === 'outlined') {
    return styles.colorOutlined
  }

  if (variant === 'standard') {
    return styles.colorStandard
  }

  return styles.colorFilled
}

function getSizeStyle(
  styles: ReturnType<typeof createStyles>,
  size: IconButtonSize,
) {
  if (size === 'small') {
    return styles.sizeSmall
  }

  if (size === 'large') {
    return styles.sizeLarge
  }

  return styles.sizeMedium
}

function getIconPixelSize(size: IconButtonSize): number {
  if (size === 'small') {
    return 18
  }

  if (size === 'large') {
    return 28
  }

  return 24
}

function getDefaultHitSlop(size: IconButtonSize): number {
  if (size === 'small') {
    return 8
  }

  if (size === 'large') {
    return 0
  }

  return 4
}

function getHoveredStyle(
  styles: ReturnType<typeof createStyles>,
  variant: IconButtonVariant,
  isToggle: boolean,
  selected: boolean,
) {
  if (isToggle) {
    if (variant === 'tonal') {
      return selected
        ? styles.hoveredTonalToggleSelected
        : styles.hoveredTonalToggleUnselected
    }

    if (variant === 'outlined') {
      return selected
        ? styles.hoveredOutlinedToggleSelected
        : styles.hoveredOutlinedToggleUnselected
    }

    if (variant === 'standard') {
      return selected
        ? styles.hoveredStandardToggleSelected
        : styles.hoveredStandardToggleUnselected
    }

    return selected
      ? styles.hoveredFilledToggleSelected
      : styles.hoveredFilledToggleUnselected
  }

  if (variant === 'tonal') {
    return styles.hoveredTonal
  }

  if (variant === 'outlined') {
    return styles.hoveredOutlined
  }

  if (variant === 'standard') {
    return styles.hoveredStandard
  }

  return styles.hoveredFilled
}

function getPressedStyle(
  styles: ReturnType<typeof createStyles>,
  variant: IconButtonVariant,
  isToggle: boolean,
  selected: boolean,
) {
  if (isToggle) {
    if (variant === 'tonal') {
      return selected
        ? styles.pressedTonalToggleSelected
        : styles.pressedTonalToggleUnselected
    }

    if (variant === 'outlined') {
      return selected
        ? styles.pressedOutlinedToggleSelected
        : styles.pressedOutlinedToggleUnselected
    }

    if (variant === 'standard') {
      return selected
        ? styles.pressedStandardToggleSelected
        : styles.pressedStandardToggleUnselected
    }

    return selected
      ? styles.pressedFilledToggleSelected
      : styles.pressedFilledToggleUnselected
  }

  if (variant === 'tonal') {
    return styles.pressedTonal
  }

  if (variant === 'outlined') {
    return styles.pressedOutlined
  }

  if (variant === 'standard') {
    return styles.pressedStandard
  }

  return styles.pressedFilled
}

function getDisabledStyle(
  styles: ReturnType<typeof createStyles>,
  variant: IconButtonVariant,
) {
  if (variant === 'tonal') {
    return styles.disabledTonal
  }

  if (variant === 'outlined') {
    return styles.disabledOutlined
  }

  if (variant === 'standard') {
    return styles.disabledStandard
  }

  return styles.disabledFilled
}

export function IconButton({
  icon,
  selectedIcon,
  iconColor,
  contentColor,
  containerColor,
  style,
  onPress,
  disabled = false,
  variant = 'filled',
  selected,
  size = 'medium',
  hitSlop,
  accessibilityLabel,
  ...props
}: IconButtonProps) {
  const theme = useTheme()
  const iconResolver = useIconResolver()
  const styles = useMemo(() => createStyles(theme), [theme])
  const isDisabled = Boolean(disabled)
  const isToggle = selected !== undefined
  const isSelected = Boolean(selected)
  const resolvedIconColor =
    contentColor ??
    iconColor ??
    getIconColor(variant, theme, isDisabled, isToggle, isSelected)
  const displayIcon =
    isToggle && isSelected && selectedIcon ? selectedIcon : icon
  const iconPixelSize = getIconPixelSize(size)
  const accessibilityState = isToggle
    ? { disabled: isDisabled, selected: isSelected }
    : { disabled: isDisabled }

  const containerOverrides = useMemo(() => {
    if (!containerColor) return null
    const overlay = resolvedIconColor
    return {
      base: {
        backgroundColor: containerColor,
        borderColor: containerColor,
        borderWidth: 0,
      } as ViewStyle,
      hovered: {
        backgroundColor: blendColor(
          containerColor,
          overlay,
          theme.stateLayer.hoveredOpacity,
        ),
      } as ViewStyle,
      pressed: {
        backgroundColor: blendColor(
          containerColor,
          overlay,
          theme.stateLayer.pressedOpacity,
        ),
      } as ViewStyle,
    }
  }, [containerColor, resolvedIconColor, theme.stateLayer])

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      disabled={isDisabled}
      hitSlop={hitSlop ?? getDefaultHitSlop(size)}
      onPress={onPress}
      style={({
        pressed,
        hovered,
      }: {
        pressed: boolean
        hovered?: boolean
      }) => {
        const base: StyleProp<ViewStyle>[] = [
          styles.container,
          getSizeStyle(styles, size),
          getColorStyle(styles, variant, isToggle, isSelected),
          containerOverrides?.base,
          hovered && !pressed && !isDisabled
            ? containerOverrides
              ? containerOverrides.hovered
              : getHoveredStyle(styles, variant, isToggle, isSelected)
            : undefined,
          pressed && !isDisabled
            ? containerOverrides
              ? containerOverrides.pressed
              : getPressedStyle(styles, variant, isToggle, isSelected)
            : undefined,
          isDisabled ? getDisabledStyle(styles, variant) : undefined,
        ]

        if (typeof style === 'function') {
          base.push(style({ pressed }))
        } else if (style) {
          base.push(style)
        }

        return base
      }}
    >
      {renderIcon(
        displayIcon,
        { size: iconPixelSize, color: resolvedIconColor },
        iconResolver,
      )}
    </Pressable>
  )
}
