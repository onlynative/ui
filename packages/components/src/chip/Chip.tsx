import { useIconResolver, useTheme } from '@onlynative/core'
import { Motion } from '@onlynative/inertia'
import {
  alphaColor,
  renderIcon,
  resolveColorFromStyle,
} from '@onlynative/utils'
import type { IconSource } from '@onlynative/utils'
import { useMemo, type ReactNode } from 'react'
import {
  Platform,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
} from 'react-native'
import { useStateLayer } from '../internal/useStateLayer'
import { createStyles, getResolvedChipColors } from './styles'
import type { ChipProps, ChipVariant } from './types'

// MD3 elevation transitions follow the standard short4 duration.
const ELEVATION_TRANSITION = { type: 'timing', duration: 250 } as const
// State-layer transition for the close-button background.
const CLOSE_TRANSITION = { type: 'timing', duration: 150 } as const

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
  const isElevatedSurface = elevated && variant !== 'input'

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

  const colors = useMemo(
    () =>
      getResolvedChipColors(
        theme,
        variant,
        elevated,
        isSelected,
        containerColor,
        contentColor,
      ),
    [theme, variant, elevated, isSelected, containerColor, contentColor],
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

  // MD3 elevation cascade for elevated chips: level 1 (rest) → level 2 (hover).
  // Disabled drops to level 0 (per MD3). Non-elevated variants skip this merge.
  const containerMotion = useMemo(() => {
    if (!isElevatedSurface) return layer.container
    const rest = isDisabled ? theme.elevation.level0 : theme.elevation.level1
    const hover = theme.elevation.level2
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
  }, [layer.container, theme.elevation, isElevatedSurface, isDisabled])

  // Close-button state layer — hover + press only, no focus state.
  const closeStateLayerHovered = useMemo(
    () => alphaColor(colors.textColor, theme.stateLayer.hoveredOpacity),
    [colors.textColor, theme.stateLayer.hoveredOpacity],
  )
  const closeStateLayerPressed = useMemo(
    () => alphaColor(colors.textColor, theme.stateLayer.pressedOpacity),
    [colors.textColor, theme.stateLayer.pressedOpacity],
  )
  const closeMotion = useMemo(
    () => ({
      animate: { backgroundColor: 'transparent' },
      gesture: isDisabled
        ? undefined
        : {
            hovered: { backgroundColor: closeStateLayerHovered },
            pressed: { backgroundColor: closeStateLayerPressed },
          },
      transition: { backgroundColor: CLOSE_TRANSITION },
    }),
    [isDisabled, closeStateLayerHovered, closeStateLayerPressed],
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
        style={styles.focusRing}
      />
      <Motion.Pressable
        {...rest}
        accessibilityRole="button"
        accessibilityState={{
          disabled: isDisabled,
          ...(variant === 'filter' ? { selected: isSelected } : undefined),
        }}
        // Bring the touch target to the WCAG/MD3 minimum of 48dp (chip is 32dp tall).
        hitSlop={Platform.OS === 'web' ? undefined : 8}
        disabled={isDisabled}
        {...containerMotion}
        style={[
          styles.container,
          isDisabled ? styles.disabledContainer : undefined,
          userStyle,
        ]}
      >
        {renderLeadingContent()}
        <Text style={computedLabelStyle}>{children}</Text>
        {showCloseIcon ? (
          <Motion.Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Remove"
            hitSlop={12}
            {...closeMotion}
            style={styles.closeButton}
          >
            {renderIcon('close', iconRenderProps, iconResolver)}
          </Motion.Pressable>
        ) : null}
      </Motion.Pressable>
    </View>
  )
}
