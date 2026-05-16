import { useIconResolver, useTheme } from '@onlynative/core'
import { Motion } from '@onlynative/inertia'
import { renderIcon } from '@onlynative/utils'
import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { useStateLayer } from '../internal/useStateLayer'
import {
  createStyles,
  getFABIconPixelSize,
  getFABSizeStyle,
  getResolvedFABColors,
} from './styles'
import type { FABProps, FABSize } from './types'

// MD3 elevation transitions follow the standard short4 duration.
const ELEVATION_TRANSITION = { type: 'timing', duration: 250 } as const

function getFocusRingSizeStyle(
  styles: ReturnType<typeof createStyles>,
  size: FABSize,
  isExtended: boolean,
) {
  if (isExtended) return styles.focusRingMedium
  if (size === 'small') return styles.focusRingSmall
  if (size === 'large') return styles.focusRingLarge
  return styles.focusRingMedium
}

export function FAB({
  icon,
  label,
  variant = 'primary',
  size: sizeProp,
  containerColor,
  contentColor,
  labelStyle: labelStyleOverride,
  style,
  onPress,
  disabled = false,
  accessibilityLabel,
  hitSlop,
  ...rest
}: FABProps) {
  const isExtended = typeof label === 'string'
  const size: FABSize = isExtended ? 'medium' : (sizeProp ?? 'medium')
  // MD3 minimum 48dp touch target — small FAB (40dp) needs 4dp hit slop.
  const resolvedHitSlop =
    hitSlop ?? (size === 'small' && !isExtended ? 4 : undefined)

  const theme = useTheme()
  const iconResolver = useIconResolver()
  const styles = useMemo(() => createStyles(theme), [theme])
  const isDisabled = Boolean(disabled)

  const colors = useMemo(
    () => getResolvedFABColors(theme, variant, containerColor, contentColor),
    [theme, variant, containerColor, contentColor],
  )

  const resolvedContentColor = isDisabled
    ? colors.disabledContentColor
    : colors.contentColor
  const iconPixelSize = getFABIconPixelSize(size)

  const layer = useStateLayer({
    colors: {
      rest: colors.backgroundColor,
      hovered: colors.hoveredBackgroundColor,
      focused: colors.focusedBackgroundColor,
      pressed: colors.pressedBackgroundColor,
      disabled: colors.disabledBackgroundColor,
    },
    isDisabled,
  })

  // MD3 elevation-on-hover cascade for FAB: level 3 (rest) → level 4 (hover).
  // Only the numeric shadow properties animate; `shadowOffset` stays at the
  // rest level (set by `styles.container`).
  const containerMotion = useMemo(() => {
    const rest = theme.elevation.level3
    const hover = theme.elevation.level4
    const animate = {
      ...layer.container.animate,
      shadowOpacity: rest.shadowOpacity,
      shadowRadius: rest.shadowRadius,
      elevation: rest.elevation,
    }
    const gesture = layer.container.gesture
      ? {
          ...layer.container.gesture,
          hovered: {
            ...layer.container.gesture.hovered,
            shadowOpacity: hover.shadowOpacity,
            shadowRadius: hover.shadowRadius,
            elevation: hover.elevation,
          },
        }
      : undefined
    const transition = {
      ...layer.container.transition,
      shadowOpacity: ELEVATION_TRANSITION,
      shadowRadius: ELEVATION_TRANSITION,
      elevation: ELEVATION_TRANSITION,
    }
    return { animate, gesture, transition }
  }, [layer.container, theme.elevation])

  const labelTextStyle = useMemo(
    () => [styles.label, { color: resolvedContentColor }, labelStyleOverride],
    [styles.label, resolvedContentColor, labelStyleOverride],
  )

  // Function-form `style` is dropped on animated components — wrapping the
  // style array in a function hides the gesture-driven backgroundColor from
  // Inertia's prop diff and breaks the cascade. Use `containerColor` /
  // `contentColor` for state-aware styling instead.
  const userStyle = typeof style === 'function' ? undefined : style

  return (
    <View style={styles.wrapper}>
      <Motion.View
        pointerEvents="none"
        {...layer.focusRing}
        style={[
          styles.focusRing,
          getFocusRingSizeStyle(styles, size, isExtended),
        ]}
      />
      <Motion.Pressable
        {...rest}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: isDisabled }}
        disabled={isDisabled}
        hitSlop={resolvedHitSlop}
        onPress={onPress}
        {...containerMotion}
        style={[
          styles.container,
          isExtended
            ? [styles.extended, icon ? styles.extendedWithIcon : undefined]
            : getFABSizeStyle(styles, size),
          isDisabled ? styles.disabled : undefined,
          userStyle,
        ]}
      >
        {icon ? (
          <View style={isExtended ? styles.extendedIcon : undefined}>
            {renderIcon(
              icon,
              { size: iconPixelSize, color: resolvedContentColor },
              iconResolver,
            )}
          </View>
        ) : null}
        {isExtended ? <Text style={labelTextStyle}>{label}</Text> : null}
      </Motion.Pressable>
    </View>
  )
}
