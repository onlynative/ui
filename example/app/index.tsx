import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@onlynative/core'

const components = [
  { label: 'Typography', route: '/typography' as const },
  { label: 'Layout', route: '/layout' as const },
  { label: 'Button', route: '/button' as const },
  { label: 'AppBar', route: '/appbar' as const },
]

export default function HomeScreen() {
  const theme = useTheme()
  const router = useRouter()

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
    >
      <Text
        style={[
          theme.typography.headlineMedium,
          { color: theme.colors.onBackground },
        ]}
      >
        Components
      </Text>
      <View style={styles.list}>
        {components.map(({ label, route }) => (
          <Pressable
            key={route}
            onPress={() => router.push(route)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.colors.surfaceContainerLow,
                borderColor: theme.colors.outlineVariant,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text
              style={[
                theme.typography.titleMedium,
                { color: theme.colors.onSurface },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    rowGap: 16,
  },
  list: {
    rowGap: 8,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
})
