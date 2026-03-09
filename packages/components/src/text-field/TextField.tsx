import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import type { NativeSyntheticEvent, TargetedEvent } from 'react-native'
import { useTheme } from '@onlynative/core'

import { getMaterialCommunityIcons } from '@onlynative/utils'
import { createStyles, labelPositions } from './styles'
import type { TextFieldProps } from './types'

const ICON_SIZE = 24
// 12dp icon inset + 24dp icon + 16dp gap
const ICON_WITH_GAP = 12 + 24 + 16

export function TextField({
  value,
  onChangeText,
  label,
  placeholder,
  variant = 'filled',
  supportingText,
  errorText,
  error = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  onTrailingIconPress,
  multiline = false,
  onFocus,
  onBlur,
  style,
  containerColor,
  contentColor,
  inputStyle,
  ...textInputProps
}: TextFieldProps) {
  const theme = useTheme()
  const isDisabled = Boolean(disabled)
  const isError = Boolean(error) || Boolean(errorText)
  const isFilled = variant === 'filled'
  const hasLeadingIcon = Boolean(leadingIcon)

  const MaterialCommunityIcons =
    leadingIcon || trailingIcon ? getMaterialCommunityIcons() : null

  const { colors, styles } = useMemo(
    () => createStyles(theme, variant),
    [theme, variant],
  )

  const [isFocused, setIsFocused] = useState(false)
  const [internalHasText, setInternalHasText] = useState(
    () => value !== undefined && value !== '',
  )
  const inputRef = useRef<TextInput>(null)

  const isControlled = value !== undefined
  const hasValue = isControlled ? value !== '' : internalHasText
  const isLabelFloated = isFocused || hasValue

  // Animation: 0 = resting (label large, centered), 1 = floated (label small, top)
  const labelAnimRef = useRef(new Animated.Value(isLabelFloated ? 1 : 0))
  const labelAnim = labelAnimRef.current

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isLabelFloated ? 1 : 0,
      duration: 150,
      useNativeDriver: Platform.OS !== 'web',
    }).start()
  }, [isLabelFloated, labelAnim])

  // Scale: bodyLarge/bodySmall when resting → 1.0 when floated.
  // Label is always rendered at bodySmall size; scale makes it appear as bodyLarge.
  const labelScale = useMemo(() => {
    const restingScale =
      theme.typography.bodyLarge.fontSize / theme.typography.bodySmall.fontSize
    return labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [restingScale, 1],
    })
  }, [
    labelAnim,
    theme.typography.bodyLarge.fontSize,
    theme.typography.bodySmall.fontSize,
  ])

  // TranslateY: moves label from floated position down to resting position.
  // Static top = floatedTop; translateY shifts it to restingTop when at rest.
  const labelTranslateY = useMemo(() => {
    const restingTop = isFilled
      ? labelPositions.filledRestingTop
      : labelPositions.outlinedRestingTop
    const floatedTop = isFilled
      ? labelPositions.filledFloatedTop
      : labelPositions.outlinedFloatedTop
    const restingOffset = restingTop - floatedTop
    return labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [restingOffset, 0],
    })
  }, [isFilled, labelAnim])

  // Label start: 16dp container padding + leading icon space (12dp inset + 24dp + 16dp gap)
  const labelStart =
    theme.spacing.md + (hasLeadingIcon ? ICON_WITH_GAP - theme.spacing.md : 0)
  // Static top = floated position; translateY handles resting offset
  const labelStaticTop = isFilled
    ? labelPositions.filledFloatedTop
    : labelPositions.outlinedFloatedTop

  const handleChangeText = useCallback(
    (text: string) => {
      if (!isControlled) {
        setInternalHasText(text !== '')
      }
      onChangeText?.(text)
    },
    [isControlled, onChangeText],
  )

  const handleFocus = useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      if (isDisabled) return
      setIsFocused(true)
      onFocus?.(event)
    },
    [isDisabled, onFocus],
  )

  const handleBlur = useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      setIsFocused(false)
      onBlur?.(event)
    },
    [onBlur],
  )

  const handleContainerPress = useCallback(() => {
    if (!isDisabled) {
      inputRef.current?.focus()
    }
  }, [isDisabled])

  const labelColor = isDisabled
    ? colors.disabledLabelColor
    : isError
      ? colors.errorLabelColor
      : isFocused
        ? colors.focusedLabelColor
        : colors.labelColor

  const labelBackgroundColor =
    variant === 'outlined' && isLabelFloated
      ? theme.colors.surface
      : 'transparent'

  const iconColor = isDisabled
    ? colors.disabledIconColor
    : isError
      ? colors.errorIconColor
      : contentColor ?? colors.iconColor

  const containerStyle = useMemo(
    () => [
      styles.container,
      containerColor && !isDisabled
        ? { backgroundColor: containerColor }
        : undefined,
      isFocused && styles.containerFocused,
      isError && !isFocused && styles.containerError,
      isDisabled && styles.containerDisabled,
    ],
    [styles, isFocused, isError, isDisabled, containerColor],
  )

  const indicatorStyle = useMemo(
    () => [
      styles.indicator,
      isFocused && styles.indicatorFocused,
      isError && !isFocused && styles.indicatorError,
      isDisabled && styles.indicatorDisabled,
    ],
    [styles, isFocused, isError, isDisabled],
  )

  const displaySupportingText = isError ? errorText : supportingText

  return (
    <View style={[styles.root, style]}>
      <Pressable onPress={handleContainerPress} disabled={isDisabled}>
        <View style={containerStyle}>
          {leadingIcon ? (
            <View style={styles.leadingIcon}>
              <MaterialCommunityIcons
                name={leadingIcon}
                size={ICON_SIZE}
                color={iconColor}
              />
            </View>
          ) : null}

          <View
            style={[
              styles.inputWrapper,
              label ? styles.inputWrapperWithLabel : undefined,
            ]}
          >
            <TextInput
              ref={inputRef}
              {...textInputProps}
              value={value}
              onChangeText={handleChangeText}
              editable={!isDisabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={isLabelFloated || !label ? placeholder : undefined}
              placeholderTextColor={colors.placeholderColor}
              multiline={multiline}
              style={[
                styles.input,
                isDisabled ? styles.inputDisabled : undefined,
                contentColor && !isDisabled
                  ? { color: contentColor }
                  : undefined,
                inputStyle,
              ]}
              accessibilityLabel={label || undefined}
              accessibilityState={{ disabled: isDisabled }}
              accessibilityHint={isError && errorText ? errorText : undefined}
            />
          </View>

          {trailingIcon ? (
            <Pressable
              onPress={onTrailingIconPress}
              disabled={isDisabled || !onTrailingIconPress}
              accessibilityRole="button"
              hitSlop={12}
              style={styles.trailingIconPressable}
            >
              <View style={styles.trailingIcon}>
                <MaterialCommunityIcons
                  name={trailingIcon}
                  size={ICON_SIZE}
                  color={iconColor}
                />
              </View>
            </Pressable>
          ) : null}

          {/* Label: rendered at bodySmall, scaled up via transform when resting */}
          {label ? (
            <Animated.Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  top: labelStaticTop,
                  start: labelStart,
                  color: labelColor,
                  backgroundColor: labelBackgroundColor,
                  transform: [
                    { translateY: labelTranslateY },
                    { scale: labelScale },
                  ],
                },
                variant === 'outlined' && isLabelFloated
                  ? styles.labelNotch
                  : undefined,
              ]}
            >
              {label}
            </Animated.Text>
          ) : null}

          {isFilled ? <View style={indicatorStyle} /> : null}
        </View>
      </Pressable>

      {displaySupportingText ? (
        <View style={styles.supportingTextRow}>
          <Text
            style={[
              styles.supportingText,
              isError ? styles.errorSupportingText : undefined,
            ]}
          >
            {displaySupportingText}
          </Text>
        </View>
      ) : null}
    </View>
  )
}
