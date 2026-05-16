import { useTheme } from '@onlynative/core'
import { Motion } from '@onlynative/inertia'
import { useMemo } from 'react'
import { Platform, Text, View } from 'react-native'
import { useStateLayer } from '../internal/useStateLayer'
import { createListItemStyles, getResolvedListItemColors } from './styles'
import type { ListItemLines, ListItemProps } from './types'

function getLines(
  supportingText?: string,
  overlineText?: string,
  supportingTextNumberOfLines?: number,
): ListItemLines {
  if (
    (supportingText && overlineText) ||
    (supportingText &&
      supportingTextNumberOfLines &&
      supportingTextNumberOfLines > 1)
  ) {
    return 3
  }
  if (supportingText || overlineText) return 2
  return 1
}

export function ListItem({
  headlineText,
  supportingText,
  overlineText,
  trailingSupportingText,
  leadingContent,
  trailingContent,
  onPress,
  disabled = false,
  containerColor,
  contentColor,
  supportingTextNumberOfLines = 1,
  style,
  ...props
}: ListItemProps) {
  const isDisabled = Boolean(disabled)
  const isInteractive = onPress !== undefined
  const theme = useTheme()
  const lines = getLines(
    supportingText,
    overlineText,
    supportingTextNumberOfLines,
  )
  const styles = useMemo(
    () => createListItemStyles(theme, lines, containerColor, contentColor),
    [theme, lines, containerColor, contentColor],
  )

  const colors = useMemo(
    () => getResolvedListItemColors(theme, containerColor),
    [theme, containerColor],
  )

  const layer = useStateLayer({
    colors: {
      rest: colors.backgroundColor,
      hovered: colors.hoveredBackgroundColor,
      focused: colors.focusedBackgroundColor,
      pressed: colors.pressedBackgroundColor,
    },
    isDisabled,
  })

  const content = (
    <>
      {leadingContent != null && (
        <View style={styles.leadingContent}>{leadingContent}</View>
      )}
      <View style={styles.textBlock}>
        {overlineText != null && (
          <Text style={styles.overlineText} numberOfLines={1}>
            {overlineText}
          </Text>
        )}
        <Text style={styles.headlineText} numberOfLines={1}>
          {headlineText}
        </Text>
        {supportingText != null && (
          <Text
            style={styles.supportingText}
            numberOfLines={supportingTextNumberOfLines}
          >
            {supportingText}
          </Text>
        )}
      </View>
      {(trailingContent != null || trailingSupportingText != null) && (
        <View style={styles.trailingBlock}>
          {trailingSupportingText != null && (
            <Text style={styles.trailingSupportingText} numberOfLines={1}>
              {trailingSupportingText}
            </Text>
          )}
          {trailingContent}
        </View>
      )}
    </>
  )

  if (!isInteractive) {
    return (
      <View {...props} style={[styles.container, style]}>
        {content}
      </View>
    )
  }

  const userStyle = typeof style === 'function' ? undefined : style

  return (
    <Motion.Pressable
      {...props}
      role="button"
      accessibilityState={{ disabled: isDisabled }}
      hitSlop={Platform.OS === 'web' ? undefined : 4}
      disabled={isDisabled}
      onPress={onPress}
      {...layer.container}
      style={[
        styles.container,
        styles.interactiveContainer,
        isDisabled ? styles.disabledContainer : undefined,
        userStyle,
      ]}
    >
      <Motion.View
        pointerEvents="none"
        {...layer.focusRing}
        style={styles.focusRing}
      />
      {isDisabled ? (
        <View style={styles.disabledContentWrapper}>{content}</View>
      ) : (
        content
      )}
    </Motion.Pressable>
  )
}
