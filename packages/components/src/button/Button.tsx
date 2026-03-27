import { useTheme } from '@onlynative/core'
import {
  getMaterialCommunityIcons,
  resolveColorFromStyle,
  resolvePressableStyle,
} from '@onlynative/utils'
import { useMemo } from 'react'
import { Platform, Pressable, Text } from 'react-native'
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

  const MaterialCommunityIcons =
    leadingIcon || trailingIcon ? getMaterialCommunityIcons() : null

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
        <MaterialCommunityIcons
          name={leadingIcon}
          size={iconSize}
          color={resolvedIconColor}
          style={styles.leadingIcon}
        />
      ) : null}
      <Text style={computedLabelStyle}>{children}</Text>
      {trailingIcon ? (
        <MaterialCommunityIcons
          name={trailingIcon}
          size={iconSize}
          color={resolvedIconColor}
          style={styles.trailingIcon}
        />
      ) : null}
    </Pressable>
  )
}
