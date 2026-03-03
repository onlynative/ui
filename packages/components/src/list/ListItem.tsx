import { useMemo } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from '@onlynative/core'

import { createListItemStyles } from './styles'
import type { ListItemLines, ListItemProps } from './types'

interface PressableState {
  pressed: boolean
  hovered?: boolean
}

function getLines(
  supportingText?: string,
  overlineText?: string,
  supportingTextNumberOfLines?: number,
): ListItemLines {
  if (
    (supportingText && overlineText) ||
    (supportingText && supportingTextNumberOfLines && supportingTextNumberOfLines > 1)
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
  supportingTextNumberOfLines = 1,
  style,
  ...props
}: ListItemProps) {
  const isDisabled = Boolean(disabled)
  const isInteractive = onPress !== undefined
  const theme = useTheme()
  const lines = getLines(supportingText, overlineText, supportingTextNumberOfLines)
  const styles = useMemo(
    () => createListItemStyles(theme, lines, containerColor),
    [theme, lines, containerColor],
  )

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

  const resolvedStyle = (state: PressableState): StyleProp<ViewStyle> => [
    styles.container,
    styles.interactiveContainer,
    state.hovered && !state.pressed && !isDisabled
      ? styles.hoveredContainer
      : undefined,
    state.pressed && !isDisabled ? styles.pressedContainer : undefined,
    isDisabled ? styles.disabledContainer : undefined,
    typeof style === 'function'
      ? (style as (state: PressableState) => ViewStyle)(state)
      : style,
  ]

  return (
    <Pressable
      {...props}
      role="button"
      accessibilityState={{ disabled: isDisabled }}
      hitSlop={Platform.OS === 'web' ? undefined : 4}
      disabled={isDisabled}
      onPress={onPress}
      style={resolvedStyle}
    >
      {isDisabled ? (
        <View style={styles.disabledContentWrapper}>
          {content}
        </View>
      ) : (
        content
      )}
    </Pressable>
  )
}
