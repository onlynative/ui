import { useTheme } from '@onlynative/core'
import { resolvePressableStyle } from '@onlynative/utils'
import { useMemo } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'
import { createListItemStyles } from './styles'
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

  return (
    <Pressable
      {...props}
      role="button"
      accessibilityState={{ disabled: isDisabled }}
      hitSlop={Platform.OS === 'web' ? undefined : 4}
      disabled={isDisabled}
      onPress={onPress}
      style={resolvePressableStyle(
        [styles.container, styles.interactiveContainer],
        styles.hoveredContainer,
        styles.pressedContainer,
        styles.disabledContainer,
        isDisabled,
        style,
      )}
    >
      {isDisabled ? (
        <View style={styles.disabledContentWrapper}>{content}</View>
      ) : (
        content
      )}
    </Pressable>
  )
}
