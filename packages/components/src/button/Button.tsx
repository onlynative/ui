import { useIconResolver, useTheme } from '@onlynative/core'
import {
  renderIcon,
  resolveColorFromStyle,
  resolvePressableStyle,
} from '@onlynative/utils'
import { useMemo } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'
import { createStyles } from './styles'
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

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      hitSlop={Platform.OS === 'web' ? undefined : 4}
      disabled={isDisabled}
      style={resolvePressableStyle(
        styles.container,
        styles.hoveredContainer,
        styles.pressedContainer,
        styles.disabledContainer,
        isDisabled,
        style,
      )}
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
    </Pressable>
  )
}
