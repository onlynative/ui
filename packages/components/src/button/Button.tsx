import { useIconResolver, useTheme } from '@onlynative/core'
import { Motion } from '@onlynative/inertia'
import { renderIcon, resolveColorFromStyle } from '@onlynative/utils'
import { useMemo } from 'react'
import { Platform, Text, View } from 'react-native'
import { useStateLayer } from '../internal/useStateLayer'
import { createStyles, getResolvedButtonColors } from './styles'
import type { ButtonProps } from './types'

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
        {...layer.focusRing}
        style={styles.focusRing}
      />
      <Motion.Pressable
        {...props}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        hitSlop={Platform.OS === 'web' ? undefined : 4}
        disabled={isDisabled}
        {...layer.container}
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
