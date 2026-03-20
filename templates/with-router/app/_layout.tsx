import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider } from '@onlynative/core'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
