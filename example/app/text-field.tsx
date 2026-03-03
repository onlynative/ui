import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@onlynative/core'
import { TextField, Typography, Column } from '@onlynative/components'

export default function TextFieldScreen() {
  const [filledValue, setFilledValue] = useState('')
  const [outlinedValue, setOutlinedValue] = useState('')
  const [errorValue, setErrorValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [multilineValue, setMultilineValue] = useState('')
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const appBarHeight = theme.topAppBar?.smallContainerHeight ?? 64

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top + appBarHeight}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Typography variant="headlineSmall">TextField Showcase</Typography>

        <Column gap="sm">
          <Typography variant="titleSmall">Filled</Typography>
          <TextField
            label="Label"
            value={filledValue}
            onChangeText={setFilledValue}
            supportingText="Supporting text"
          />
          <TextField
            label="With icons"
            leadingIcon="magnify"
            trailingIcon="close-circle"
            onTrailingIconPress={() => {}}
          />
          <TextField label="Disabled" disabled value="Disabled value" />
        </Column>

        <Column gap="sm">
          <Typography variant="titleSmall">Outlined</Typography>
          <TextField
            variant="outlined"
            label="Label"
            value={outlinedValue}
            onChangeText={setOutlinedValue}
            supportingText="Supporting text"
          />
          <TextField
            variant="outlined"
            label="With icons"
            leadingIcon="magnify"
            trailingIcon="close-circle"
            onTrailingIconPress={() => {}}
          />
          <TextField
            variant="outlined"
            label="Disabled"
            disabled
            value="Disabled value"
          />
        </Column>

        <Column gap="sm">
          <Typography variant="titleSmall">Error States</Typography>
          <TextField
            label="Filled error"
            value={errorValue}
            onChangeText={setErrorValue}
            error
            errorText="Error message goes here"
            trailingIcon="alert-circle"
          />
          <TextField
            variant="outlined"
            label="Outlined error"
            value={errorValue}
            onChangeText={setErrorValue}
            error
            errorText="Error message goes here"
            trailingIcon="alert-circle"
          />
        </Column>

        <Column gap="sm">
          <Typography variant="titleSmall">Password</Typography>
          <TextField
            label="Password"
            value={passwordValue}
            onChangeText={setPasswordValue}
            secureTextEntry={!showPassword}
            trailingIcon={showPassword ? 'eye-off' : 'eye'}
            onTrailingIconPress={() => setShowPassword((prev) => !prev)}
          />
        </Column>

        <Column gap="sm">
          <Typography variant="titleSmall">Multiline</Typography>
          <TextField
            label="Description"
            value={multilineValue}
            onChangeText={setMultilineValue}
            multiline
            numberOfLines={4}
          />
        </Column>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    rowGap: 20,
  },
})
