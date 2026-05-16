import { useIconResolver, useTheme } from '@onlynative/core'
import { useAnimation, useGesture } from '@onlynative/inertia'
import { renderIcon } from '@onlynative/utils'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import type { NativeSyntheticEvent, TargetedEvent } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated'
import { createStyles, labelPositions } from './styles'
import type { TextFieldProps } from './types'

const ICON_SIZE = 24
// 12dp icon inset + 24dp icon + 16dp gap
const ICON_WITH_GAP = 12 + 24 + 16

// M3 standard easing — `cubic-bezier(0.2, 0, 0, 1)`. Decelerates into the
// resting position and reads as polished even if iOS drops a frame mid-anim.
// `Easing.bezier(...)` returns an `EasingFunctionFactory` wrapper; calling
// `.factory()` unwraps it to the plain `(t: number) => number` shape Inertia's
// `TimingTransition.easing` expects.
const M3_STANDARD = Easing.bezier(0.2, 0, 0, 1).factory()

// 200 ms = M3 short4 duration. The previous 150 ms left only ~9 frames at
// 60 fps; one dropped frame on iOS was enough to read as choppy. 200 ms
// (~12 frames) gives the curve room to breathe.
const LABEL_TRANSITION = {
  type: 'timing',
  duration: 200,
  easing: M3_STANDARD,
} as const
const FOCUS_TRANSITION = {
  type: 'timing',
  duration: 200,
  easing: M3_STANDARD,
} as const
const ERROR_TRANSITION = {
  type: 'timing',
  duration: 200,
  easing: M3_STANDARD,
} as const
const HOVER_TRANSITION = {
  type: 'timing',
  duration: 150,
  easing: M3_STANDARD,
} as const

// MD3: filled text-field hover state-layer opacity (on-surface 8%).
const HOVER_OPACITY = 0.08

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
  const iconResolver = useIconResolver()
  const isDisabled = Boolean(disabled)
  const isError = Boolean(error) || Boolean(errorText)
  const isFilled = variant === 'filled'
  const hasLeadingIcon = Boolean(leadingIcon)

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

  // Three JS-thread-driven progress values. `useAnimation` re-runs whenever
  // its target changes, so the useEffect + withTiming pairs collapse to one
  // declaration each.
  const focused = useAnimation(isFocused ? 1 : 0, FOCUS_TRANSITION)
  const errored = useAnimation(isError ? 1 : 0, ERROR_TRANSITION)
  const hasValueShared = useAnimation(hasValue ? 1 : 0, LABEL_TRANSITION)

  // `useGesture` provides the hovered SV and a handler bag. The press/focus
  // sub-states it allocates are unused — TextField focus lives on the inner
  // TextInput (not on the wrapper Pressable, which is `focusable={false}`).
  const { hovered, handlers: gestureHandlers } = useGesture({
    hovered: HOVER_TRANSITION,
  })

  // 0 = resting (label large, centered), 1 = floated (label small, top).
  // Derived on the UI thread so it starts moving the same frame `focused`
  // does — no one-frame skew between the color/border and position animations.
  const labelProgress = useDerivedValue(() =>
    Math.max(focused.value, hasValueShared.value),
  )

  // Label is rendered at bodySmall and scaled up to bodyLarge when at rest.
  const restingScale =
    theme.typography.bodyLarge.fontSize / theme.typography.bodySmall.fontSize

  const restingTop = isFilled
    ? labelPositions.filledRestingTop
    : labelPositions.outlinedRestingTop
  const floatedTop = isFilled
    ? labelPositions.filledFloatedTop
    : labelPositions.outlinedFloatedTop
  // Static top is the floated position; translateY shifts it down to resting.
  const restingOffset = restingTop - floatedTop

  const labelRestColor = colors.labelColor
  const labelHoverColor = colors.hoverLabelColor
  const labelFocusColor = colors.focusedLabelColor
  const labelErrorColor = colors.errorLabelColor
  const borderRestColor = colors.borderColor
  const borderHoverColor = colors.hoverBorderColor
  const borderFocusColor = colors.focusedBorderColor
  const borderErrorColor = colors.errorBorderColor

  // Transform on the wrapper View — keeps the layer transform off of Text
  // composition so iOS doesn't have to re-rasterise glyphs while scaling.
  const animatedLabelTransformStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          labelProgress.value,
          [0, 1],
          [restingOffset, 0],
        ),
      },
      { scale: interpolate(labelProgress.value, [0, 1], [restingScale, 1]) },
    ],
  }))

  // Color on the inner Animated.Text. MD3 cascade: rest → hover → error →
  // focused. Hover is the lowest-priority modifier; error and focused both
  // override it. Matches the indicator/border colour cascade.
  const animatedLabelColorStyle = useAnimatedStyle(() => {
    const hoveredColor = interpolateColor(
      hovered.value,
      [0, 1],
      [labelRestColor, labelHoverColor],
    )
    const erroredColor = interpolateColor(
      errored.value,
      [0, 1],
      [hoveredColor, labelErrorColor],
    )
    const finalColor = interpolateColor(
      focused.value,
      [0, 1],
      [erroredColor, labelFocusColor],
    )
    return { color: finalColor }
  })

  // Filled active indicator: 1 dp resting → 2 dp focus or error, color
  // crossfade. MD3 cascade: rest → hover → error → focused. Hover is the
  // lowest-priority modifier; error and focused both override it.
  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const hoveredBg = interpolateColor(
      hovered.value,
      [0, 1],
      [borderRestColor, borderHoverColor],
    )
    const erroredBg = interpolateColor(
      errored.value,
      [0, 1],
      [hoveredBg, borderErrorColor],
    )
    const finalBg = interpolateColor(
      focused.value,
      [0, 1],
      [erroredBg, borderFocusColor],
    )
    const focusedHeight = interpolate(focused.value, [0, 1], [1, 2])
    const finalHeight = interpolate(errored.value, [0, 1], [focusedHeight, 2])
    return {
      backgroundColor: finalBg,
      height: finalHeight,
    }
  })

  // Outlined border drawn as an absolute overlay so its width can animate
  // 1 → 2 dp without ever moving the container's padding box. The label and
  // input keep their static positions; nothing snaps on focus/blur.
  // Same MD3 colour cascade as the filled indicator: rest → hover → error → focus.
  const animatedBorderLayerStyle = useAnimatedStyle(() => {
    const hoveredBorder = interpolateColor(
      hovered.value,
      [0, 1],
      [borderRestColor, borderHoverColor],
    )
    const erroredBorder = interpolateColor(
      errored.value,
      [0, 1],
      [hoveredBorder, borderErrorColor],
    )
    const finalBorder = interpolateColor(
      focused.value,
      [0, 1],
      [erroredBorder, borderFocusColor],
    )
    const focusedWidth = interpolate(focused.value, [0, 1], [1, 2])
    const finalWidth = interpolate(errored.value, [0, 1], [focusedWidth, 2])
    return { borderWidth: finalWidth, borderColor: finalBorder }
  })

  // Manual gate on isDisabled — `useGesture` updates `hovered` on hover
  // regardless, so we mute the opacity here when the field is disabled. The
  // hover layer is only rendered for the filled variant, so we don't need an
  // `isFilled` gate.
  const animatedHoverLayerStyle = useAnimatedStyle(() => ({
    opacity: isDisabled ? 0 : hovered.value * HOVER_OPACITY,
  }))

  // Label start: 16dp container padding + leading icon space (12dp inset + 24dp + 16dp gap)
  const labelStart =
    theme.spacing.md + (hasLeadingIcon ? ICON_WITH_GAP - theme.spacing.md : 0)
  const labelStaticTop = floatedTop

  const handleChangeText = useCallback(
    (text: string) => {
      if (!isControlled) setInternalHasText(text !== '')
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
    if (!isDisabled) inputRef.current?.focus()
  }, [isDisabled])

  const iconColor = isDisabled
    ? colors.disabledIconColor
    : isError
      ? colors.errorIconColor
      : (contentColor ?? colors.iconColor)

  const containerColorOverride = useMemo(
    () =>
      containerColor && !isDisabled
        ? { backgroundColor: containerColor }
        : undefined,
    [containerColor, isDisabled],
  )

  const containerStyleArr = useMemo(
    () => [
      styles.container,
      isDisabled ? styles.containerDisabled : undefined,
      containerColorOverride,
    ],
    [styles, isDisabled, containerColorOverride],
  )

  const borderLayerDisabledOverride = useMemo(
    () =>
      !isFilled && isDisabled
        ? { borderColor: colors.disabledBorderColor, borderWidth: 1 }
        : undefined,
    [isFilled, isDisabled, colors.disabledBorderColor],
  )

  const borderLayerStyleArr = useMemo(
    () => [
      styles.borderLayer,
      animatedBorderLayerStyle,
      borderLayerDisabledOverride,
    ],
    [styles, animatedBorderLayerStyle, borderLayerDisabledOverride],
  )

  const indicatorStyleArr = useMemo(
    () => [
      styles.indicator,
      animatedIndicatorStyle,
      isDisabled ? styles.indicatorDisabled : undefined,
    ],
    [styles, animatedIndicatorStyle, isDisabled],
  )

  const hoverLayerStyleArr = useMemo(
    () => [styles.hoverLayer, animatedHoverLayerStyle],
    [styles.hoverLayer, animatedHoverLayerStyle],
  )

  const labelStaticPos = useMemo(
    () => ({
      top: labelStaticTop,
      start: labelStart,
    }),
    [labelStaticTop, labelStart],
  )

  const labelDisabledColor = useMemo(
    () => (isDisabled ? { color: colors.disabledLabelColor } : undefined),
    [isDisabled, colors.disabledLabelColor],
  )

  // The notch paints over the border at the top of an outlined field so the
  // floated label reads cleanly. Its background must match the effective
  // container behind the field — when a consumer supplies `containerColor`
  // on an outlined variant, the default `theme.colors.surface` would punch
  // through with the wrong colour.
  const labelNotchOverride = useMemo(
    () => (containerColor ? { backgroundColor: containerColor } : undefined),
    [containerColor],
  )

  const labelWrapperStyleArr = useMemo(
    () => [
      styles.labelWrapper,
      labelStaticPos,
      variant === 'outlined' && isLabelFloated
        ? styles.labelWrapperNotch
        : undefined,
      variant === 'outlined' && isLabelFloated ? labelNotchOverride : undefined,
      animatedLabelTransformStyle,
    ],
    [
      styles,
      labelStaticPos,
      variant,
      isLabelFloated,
      labelNotchOverride,
      animatedLabelTransformStyle,
    ],
  )

  const labelTextStyleArr = useMemo(
    () => [styles.labelText, animatedLabelColorStyle, labelDisabledColor],
    [styles, animatedLabelColorStyle, labelDisabledColor],
  )

  const inputWrapperStyleArr = useMemo(
    () => [
      styles.inputWrapper,
      label ? styles.inputWrapperWithLabel : undefined,
    ],
    [styles, label],
  )

  const inputContentColor = useMemo(
    () => (contentColor && !isDisabled ? { color: contentColor } : undefined),
    [contentColor, isDisabled],
  )

  const inputStyleArr = useMemo(
    () => [
      styles.input,
      isDisabled ? styles.inputDisabled : undefined,
      inputContentColor,
      inputStyle,
    ],
    [styles, isDisabled, inputContentColor, inputStyle],
  )

  const supportingTextStyleArr = useMemo(
    () => [
      styles.supportingText,
      isError ? styles.errorSupportingText : undefined,
    ],
    [styles, isError],
  )

  const rootStyle = useMemo(() => [styles.root, style], [styles, style])

  const displaySupportingText = isError ? errorText : supportingText

  return (
    <View style={rootStyle}>
      <Pressable
        onPress={handleContainerPress}
        {...gestureHandlers}
        disabled={isDisabled}
        accessible={false}
        focusable={false}
        style={styles.pressableReset}
      >
        <Animated.View style={containerStyleArr}>
          {isFilled ? (
            <Animated.View pointerEvents="none" style={hoverLayerStyleArr} />
          ) : null}

          {leadingIcon ? (
            <View style={styles.leadingIcon}>
              {renderIcon(
                leadingIcon,
                { size: ICON_SIZE, color: iconColor },
                iconResolver,
              )}
            </View>
          ) : null}

          <View style={inputWrapperStyleArr}>
            <TextInput
              ref={inputRef}
              {...textInputProps}
              value={value}
              onChangeText={handleChangeText}
              editable={!isDisabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={
                !isDisabled && (isLabelFloated || !label)
                  ? placeholder
                  : undefined
              }
              placeholderTextColor={colors.placeholderColor}
              multiline={multiline}
              style={inputStyleArr}
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
                {renderIcon(
                  trailingIcon,
                  { size: ICON_SIZE, color: iconColor },
                  iconResolver,
                )}
              </View>
            </Pressable>
          ) : null}

          {!isFilled ? (
            <Animated.View pointerEvents="none" style={borderLayerStyleArr} />
          ) : null}

          {label ? (
            <Animated.View pointerEvents="none" style={labelWrapperStyleArr}>
              <Animated.Text numberOfLines={1} style={labelTextStyleArr}>
                {label}
              </Animated.Text>
            </Animated.View>
          ) : null}

          {isFilled ? <Animated.View style={indicatorStyleArr} /> : null}
        </Animated.View>
      </Pressable>

      {displaySupportingText ? (
        <View style={styles.supportingTextRow}>
          <Text style={supportingTextStyleArr}>{displaySupportingText}</Text>
        </View>
      ) : null}
    </View>
  )
}
