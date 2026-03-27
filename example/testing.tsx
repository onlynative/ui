import React from 'react'
import type { ViewStyle } from 'react-native'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
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
}: Props): React.JSX.Element {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={keyboardVerticalOffset}
      {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
    >
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
