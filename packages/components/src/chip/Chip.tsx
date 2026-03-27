import { useTheme } from '@onlynative/core'
import {
  getMaterialCommunityIcons,
  resolveColorFromStyle,
  resolvePressableStyle,
} from '@onlynative/utils'
import { useMemo } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'
import { createStyles } from './styles'
import type { ChipProps } from './types'

export function Chip({
  children,
  style,
  variant = 'assist',
  elevated = false,
  selected = false,
  leadingIcon,
  iconSize = 18,
  avatar,
  onClose,
  containerColor,
  contentColor,
  labelStyle: labelStyleOverride,
  disabled = false,
  ...props
}: ChipProps) {
  const isDisabled = Boolean(disabled)
  const isSelected = variant === 'filter' ? Boolean(selected) : false

  const showCloseIcon =
    onClose !== undefined &&
    (variant === 'input' || (variant === 'filter' && isSelected))

  const hasLeadingContent = Boolean(
    (variant === 'input' && avatar) ||
    leadingIcon ||
    (variant === 'filter' && isSelected),
  )

  const needsIcons =
    Boolean(leadingIcon) ||
    (variant === 'filter' && isSelected) ||
    showCloseIcon
  const MaterialCommunityIcons = needsIcons ? getMaterialCommunityIcons() : null

  const theme = useTheme()
  const styles = useMemo(
    () =>
      createStyles(
        theme,
        variant,
        elevated,
        isSelected,
        hasLeadingContent,
        showCloseIcon,
        containerColor,
        contentColor,
      ),
    [
      theme,
      variant,
      elevated,
      isSelected,
      hasLeadingContent,
      showCloseIcon,
      containerColor,
      contentColor,
    ],
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

  const renderLeadingContent = () => {
    if (variant === 'input' && avatar) {
      return <View style={styles.avatar}>{avatar}</View>
    }
    if (leadingIcon) {
      return (
        <MaterialCommunityIcons
          name={leadingIcon}
          size={iconSize}
          color={resolvedIconColor}
          style={styles.leadingIcon}
        />
      )
    }
    if (variant === 'filter' && isSelected) {
      return (
        <MaterialCommunityIcons
          name="check"
          size={iconSize}
          color={resolvedIconColor}
          style={styles.leadingIcon}
        />
      )
    }
    return null
  }

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        ...(variant === 'filter' ? { selected: isSelected } : undefined),
      }}
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
      {renderLeadingContent()}
      <Text style={computedLabelStyle}>{children}</Text>
      {showCloseIcon ? (
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Remove"
          hitSlop={4}
          style={styles.closeButton}
        >
          <MaterialCommunityIcons
            name="close"
            size={iconSize}
            color={resolvedIconColor}
          />
        </Pressable>
      ) : null}
    </Pressable>
  )
}
