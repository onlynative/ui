import React from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ViewStyle
} from 'react-native'

type Props = {
  children: React.ReactNode
  keyboardVerticalOffset?: number
  contentContainerStyle?: ViewStyle
}

export default function KeyboardWrapper({
  children,
  keyboardVerticalOffset,
  ...rest
}: Props): JSX.Element {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={keyboardVerticalOffset}
      {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}>
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...rest}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
