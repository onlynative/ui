import { useIconResolver, useTheme } from '@onlynative/core'
import {
  renderIcon,
  resolveColorFromStyle,
  resolvePressableStyle,
} from '@onlynative/utils'
import type { IconSource } from '@onlynative/utils'
import { useMemo, type ReactNode } from 'react'
import {
  Platform,
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
} from 'react-native'
import { createStyles } from './styles'
import type { ChipProps, ChipVariant } from './types'

type ChipImplProps = Omit<PressableProps, 'children'> & {
  children: string
  variant?: ChipVariant
  elevated?: boolean
  selected?: boolean
  leadingIcon?: IconSource
  iconSize?: number
  avatar?: ReactNode
  onClose?: () => void
  containerColor?: string
  contentColor?: string
  labelStyle?: StyleProp<TextStyle>
}

export function Chip(props: ChipProps) {
  const {
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
    ...rest
  } = props as ChipImplProps
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

  const theme = useTheme()
  const iconResolver = useIconResolver()
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

  const iconRenderProps = { size: iconSize, color: resolvedIconColor }

  const renderLeadingContent = () => {
    if (variant === 'input' && avatar) {
      return <View style={styles.avatar}>{avatar}</View>
    }
    if (leadingIcon) {
      return (
        <View style={styles.leadingIcon}>
          {renderIcon(leadingIcon, iconRenderProps, iconResolver)}
        </View>
      )
    }
    if (variant === 'filter' && isSelected) {
      return (
        <View style={styles.leadingIcon}>
          {renderIcon('check', iconRenderProps, iconResolver)}
        </View>
      )
    }
    return null
  }

  return (
    <Pressable
      {...rest}
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
          {renderIcon('close', iconRenderProps, iconResolver)}
        </Pressable>
      ) : null}
    </Pressable>
  )
}
