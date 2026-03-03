import { useRouter } from 'expo-router'
import { Card, Column, Typography } from '@onlynative/components'
import { ScrollView, StyleSheet } from 'react-native'

const components = [
  { label: 'Typography', route: '/typography' as const },
  { label: 'Layout', route: '/layout' as const },
  { label: 'Button', route: '/button' as const },
  { label: 'AppBar', route: '/appbar' as const },
  { label: 'Card', route: '/card' as const },
  { label: 'Chip', route: '/chip' as const },
  { label: 'Checkbox', route: '/checkbox' as const },
  { label: 'Radio', route: '/radio' as const },
  { label: 'Switch', route: '/switch' as const },
  { label: 'TextField', route: '/text-field' as const },
]

export default function HomeScreen() {
  const router = useRouter()

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Column gap="sm">
        {components.map(({ label, route }) => (
          <Card
            key={route}
            variant="outlined"
            onPress={() => router.push(route)}
          >
            <Column p="md">
              <Typography variant="titleMedium">{label}</Typography>
            </Column>
          </Card>
        ))}
      </Column>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
})
