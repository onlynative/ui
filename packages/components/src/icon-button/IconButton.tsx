import { useIconResolver, useTheme } from '@onlynative/core'
import { Motion } from '@onlynative/inertia'
import { alphaColor, renderIcon } from '@onlynative/utils'
import { useMemo } from 'react'
import { View } from 'react-native'
import {
  applyContainerColorOverride,
  createStyles,
  getIconButtonColors,
} from './styles'
import type {
  IconButtonProps,
  IconButtonSize,
  IconButtonVariant,
} from './types'

const BG_TRANSITION = { type: 'timing', duration: 150 } as const
const FOCUS_RING_TRANSITION = { type: 'timing', duration: 200 } as const

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

function getSizeStyle(
  styles: ReturnType<typeof createStyles>,
  size: IconButtonSize,
) {
  if (size === 'small') return styles.sizeSmall
  if (size === 'large') return styles.sizeLarge
  return styles.sizeMedium
}

function getIconPixelSize(size: IconButtonSize): number {
  if (size === 'small') return 18
  if (size === 'large') return 28
  return 24
}

function getDefaultHitSlop(size: IconButtonSize): number {
  if (size === 'small') return 8
  if (size === 'large') return 0
  return 4
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

  const colors = useMemo(() => {
    const base = getIconButtonColors(theme, variant, isToggle, isSelected)
    if (!containerColor) return base
    return applyContainerColorOverride(
      theme,
      base,
      containerColor,
      resolvedIconColor,
    )
  }, [theme, variant, isToggle, isSelected, containerColor, resolvedIconColor])

  const restBackgroundColor = isDisabled
    ? colors.disabledBackgroundColor
    : colors.backgroundColor

  const animate = useMemo(
    () => ({ backgroundColor: restBackgroundColor }),
    [restBackgroundColor],
  )

  const initialAnimate = useMemo(
    () => ({ backgroundColor: restBackgroundColor }),
    [restBackgroundColor],
  )

  const gesture = useMemo(
    () =>
      isDisabled
        ? undefined
        : {
            hovered: { backgroundColor: colors.hoveredBackgroundColor },
            focusVisible: { backgroundColor: colors.focusedBackgroundColor },
            pressed: { backgroundColor: colors.pressedBackgroundColor },
          },
    [
      isDisabled,
      colors.hoveredBackgroundColor,
      colors.focusedBackgroundColor,
      colors.pressedBackgroundColor,
    ],
  )

  const focusRingGesture = useMemo(
    () =>
      isDisabled
        ? undefined
        : {
            focusVisible: { opacity: 1 },
          },
    [isDisabled],
  )

  const transition = useMemo(() => ({ backgroundColor: BG_TRANSITION }), [])
  const focusRingTransition = useMemo(
    () => ({ opacity: FOCUS_RING_TRANSITION }),
    [],
  )

  const disabledOverride = isDisabled
    ? { borderColor: colors.disabledBorderColor }
    : undefined

  // Function-form `style` is dropped on animated components — wrapping the
  // style array in a function hides the gesture-driven backgroundColor from
  // Inertia's prop diff and breaks the cascade. Use `containerColor` /
  // `contentColor` for state-aware styling.
  const userStyle = typeof style === 'function' ? undefined : style

  return (
    <View style={styles.wrapper}>
      <Motion.View
        pointerEvents="none"
        initial={{ opacity: 0 }}
        gesture={focusRingGesture}
        transition={focusRingTransition}
        style={styles.focusRing}
      />
      <Motion.Pressable
        {...props}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={accessibilityState}
        disabled={isDisabled}
        hitSlop={hitSlop ?? getDefaultHitSlop(size)}
        onPress={onPress}
        initial={initialAnimate}
        animate={animate}
        gesture={gesture}
        transition={transition}
        style={[
          styles.container,
          getSizeStyle(styles, size),
          { borderColor: colors.borderColor, borderWidth: colors.borderWidth },
          disabledOverride,
          isDisabled ? styles.disabled : undefined,
          userStyle,
        ]}
      >
        {renderIcon(
          displayIcon,
          { size: iconPixelSize, color: resolvedIconColor },
          iconResolver,
        )}
      </Motion.Pressable>
    </View>
  )
}
