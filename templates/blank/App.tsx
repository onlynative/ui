import { StyleSheet, ScrollView, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider, useTheme } from '@onlynative/core'
import { Box, Column, Typography, Button, Card } from '@onlynative/components'

function HomeScreen() {
  const theme = useTheme()

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.surface }}
      contentContainerStyle={styles.container}
    >
      <Column gap="lg" style={styles.content}>
        <Column gap="sm">
          <Typography variant="headlineMedium">
            Welcome to OnlyNative
          </Typography>
          <Typography
            variant="bodyLarge"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Material Design 3 components for React Native
          </Typography>
        </Column>

        <Card variant="filled" style={styles.card}>
          <Column px="lg" py="lg" gap="md">
            <Typography variant="titleMedium">Get Started</Typography>
            <Typography
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Edit App.tsx to start building your app. Check out the docs for
              the full component API.
            </Typography>
          </Column>
        </Card>

        <Column gap="sm">
          <Typography variant="titleMedium">Buttons</Typography>
          <Box direction="row" gap="sm" wrap>
            <Button variant="filled" onPress={() => Alert.alert('Filled')}>
              Filled
            </Button>
            <Button variant="outlined" onPress={() => Alert.alert('Outlined')}>
              Outlined
            </Button>
            <Button variant="tonal" onPress={() => Alert.alert('Tonal')}>
              Tonal
            </Button>
            <Button variant="text" onPress={() => Alert.alert('Text')}>
              Text
            </Button>
          </Box>
        </Column>

        <Column gap="sm">
          <Typography variant="titleMedium">Cards</Typography>
          {(['elevated', 'filled', 'outlined'] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              <Column px="lg" py="md">
                <Typography variant="titleSmall">
                  {variant.charAt(0).toUpperCase() + variant.slice(1)} Card
                </Typography>
                <Typography
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  A {variant} card variant
                </Typography>
              </Column>
            </Card>
          ))}
        </Column>
      </Column>
    </ScrollView>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 32,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: 16,
  },
  card: {
    overflow: 'hidden',
  },
})
