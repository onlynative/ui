import { useIconResolver, useTheme } from '@onlynative/core'
import { Motion } from '@onlynative/inertia'
import { renderIcon, resolveColorFromStyle } from '@onlynative/utils'
import { useMemo } from 'react'
import { Platform, Text, View } from 'react-native'
import { createStyles, getResolvedButtonColors } from './styles'
import type { ButtonProps } from './types'

const BG_TRANSITION = { type: 'timing', duration: 150 } as const
const FOCUS_RING_TRANSITION = { type: 'timing', duration: 200 } as const

export function Button({
  children,
  style,
  variant = 'filled',
  leadingIcon,
  trailingIcon,
  iconSize = 18,
  containerColor,
  contentColor,
  labelStyle: labelStyleOverride,
  disabled = false,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled)
  const hasLeading = Boolean(leadingIcon)
  const hasTrailing = Boolean(trailingIcon)
  const theme = useTheme()
  const iconResolver = useIconResolver()

  const styles = useMemo(
    () =>
      createStyles(
        theme,
        variant,
        hasLeading,
        hasTrailing,
        containerColor,
        contentColor,
      ),
    [theme, variant, hasLeading, hasTrailing, containerColor, contentColor],
  )

  const colors = useMemo(
    () => getResolvedButtonColors(theme, variant, containerColor, contentColor),
    [theme, variant, containerColor, contentColor],
  )

  // The rest target lives on `animate` (and `initial` to seed without a flash
  // from Inertia's transparent default). Disabled drives a separate target so
  // the gesture map can be omitted.
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

  // Layered state cascade: rest → focusVisible → hover → press. Inertia's
  // `gesture` prop selects the highest-priority active sub-state per-property
  // (priority: pressed > focusVisible > focused > hovered) and transitions
  // backgroundColor between targets via the shared transition below. Disabling
  // the component drops the gesture map so no state layer mounts.
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

  const resolvedIconColor = useMemo(
    () =>
      resolveColorFromStyle(
        styles.label,
        isDisabled ? styles.disabledLabel : undefined,
      ),
    [styles.label, styles.disabledLabel, isDisabled],
  )

  const computedLabelStyle = useMemo(
    () => [
      styles.label,
      isDisabled ? styles.disabledLabel : undefined,
      labelStyleOverride,
    ],
    [isDisabled, styles.disabledLabel, styles.label, labelStyleOverride],
  )

  const iconRenderProps = { size: iconSize, color: resolvedIconColor }

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
        accessibilityState={{ disabled: isDisabled }}
        hitSlop={Platform.OS === 'web' ? undefined : 4}
        disabled={isDisabled}
        initial={initialAnimate}
        animate={animate}
        gesture={gesture}
        transition={transition}
        style={[
          styles.container,
          isDisabled ? styles.disabledContainer : undefined,
          userStyle,
        ]}
      >
        {leadingIcon ? (
          <View style={styles.leadingIcon}>
            {renderIcon(leadingIcon, iconRenderProps, iconResolver)}
          </View>
        ) : null}
        <Text style={computedLabelStyle}>{children}</Text>
        {trailingIcon ? (
          <View style={styles.trailingIcon}>
            {renderIcon(trailingIcon, iconRenderProps, iconResolver)}
          </View>
        ) : null}
      </Motion.Pressable>
    </View>
  )
}
