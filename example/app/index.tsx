import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Box, Card, Column, Grid, Typography } from '@onlynative/components'
import { useTheme, useBreakpointValue } from '@onlynative/core'
import type { Colors } from '@onlynative/core'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet } from 'react-native'

interface ComponentEntry {
  label: string
  route: string
  description: string
  colorKey: keyof Colors
  icon: keyof typeof MaterialCommunityIcons.glyphMap
}

const components: ComponentEntry[] = [
  {
    label: 'AppBar',
    route: '/appbar',
    description: 'Top app bars for navigation and actions',
    colorKey: 'primaryContainer',
    icon: 'dock-top',
  },
  {
    label: 'Typography',
    route: '/typography',
    description: 'Display, headline, body, and label text styles',
    colorKey: 'secondaryContainer',
    icon: 'format-text',
  },
  {
    label: 'Button',
    route: '/button',
    description: 'Filled, outlined, tonal, elevated, and text buttons',
    colorKey: 'tertiaryContainer',
    icon: 'gesture-tap-button',
  },
  {
    label: 'Chip',
    route: '/chip',
    description: 'Compact elements for filters and selections',
    colorKey: 'primaryFixedDim',
    icon: 'label-outline',
  },
  {
    label: 'TextField',
    route: '/text-field',
    description: 'Text input fields with filled and outlined styles',
    colorKey: 'secondaryFixedDim',
    icon: 'form-textbox',
  },
  {
    label: 'Card',
    route: '/card',
    description: 'Contained surfaces for grouping related content',
    colorKey: 'tertiaryContainer',
    icon: 'card-outline',
  },
  {
    label: 'List',
    route: '/list',
    description: 'Vertically arranged items with text and icons',
    colorKey: 'surfaceContainerHigh',
    icon: 'format-list-bulleted',
  },
  {
    label: 'Layout',
    route: '/layout',
    description: 'Flexbox primitives for building page structure',
    colorKey: 'primaryContainer',
    icon: 'view-grid-outline',
  },
  {
    label: 'Switch',
    route: '/switch',
    description: 'Toggle controls for on/off settings',
    colorKey: 'secondaryContainer',
    icon: 'toggle-switch-outline',
  },
  {
    label: 'Checkbox',
    route: '/checkbox',
    description: 'Selection controls for multiple choices',
    colorKey: 'tertiaryContainer',
    icon: 'checkbox-marked-outline',
  },
  {
    label: 'Radio',
    route: '/radio',
    description: 'Selection controls for single choice options',
    colorKey: 'primaryFixedDim',
    icon: 'radiobox-marked',
  },
  {
    label: 'Keyboard Wrapper',
    route: '/keyboard-avoiding-wrapper',
    description: 'Smart keyboard-aware wrapper with auto platform behavior',
    colorKey: 'secondaryFixedDim',
    icon: 'keyboard-outline',
  },
  {
    label: 'Avatar',
    route: '/avatar',
    description: 'Circular user representations with image, icon, or initials',
    colorKey: 'primaryContainer',
    icon: 'account-circle-outline',
  },
  {
    label: 'Slider',
    route: '/slider',
    description: 'Continuous, discrete, range, and centered MD3 sliders',
    colorKey: 'secondaryContainer',
    icon: 'tune-variant',
  },
  {
    label: 'Progress',
    route: '/progress',
    description:
      'Linear and circular progress indicators (determinate / indeterminate)',
    colorKey: 'tertiaryContainer',
    icon: 'progress-clock',
  },
  {
    label: 'RTL',
    route: '/rtl',
    description:
      'Right-to-left layout showcase — toggle direction from the AppBar',
    colorKey: 'tertiaryContainer',
    icon: 'format-pilcrow-arrow-left',
  },
]

export default function HomeScreen() {
  const router = useRouter()
  const theme = useTheme()
  const columns = useBreakpointValue({ compact: 2, medium: 4 })
  const padding = useBreakpointValue({
    compact: 16,
    medium: 24,
    expanded: 32,
  })
  const previewHeight = useBreakpointValue({
    compact: 100,
    medium: 120,
    expanded: 140,
  })
  const iconSize = useBreakpointValue({
    compact: 32,
    medium: 36,
    expanded: 40,
  })
  const headingVariant = useBreakpointValue({
    compact: 'titleLarge' as const,
    medium: 'headlineSmall' as const,
    expanded: 'headlineMedium' as const,
  })

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { padding, paddingBottom: padding * 2 },
      ]}
    >
      <Box style={styles.container}>
        <Typography variant={headingVariant} style={styles.heading}>
          Components
        </Typography>
        <Grid columns={columns} gap="md">
          {components.map((item) => (
            <Card
              key={item.route}
              variant="outlined"
              onPress={() => router.push(item.route)}
              style={styles.card}
            >
              <Box
                align="center"
                justify="center"
                bg={theme.colors[item.colorKey]}
                style={{ height: previewHeight }}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={iconSize}
                  color={theme.colors.onSurface}
                  style={styles.icon}
                />
              </Box>
              <Column px="md" py="sm" gap="xs">
                <Typography variant="titleMedium">{item.label}</Typography>
                <Typography
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                  numberOfLines={2}
                >
                  {item.description}
                </Typography>
              </Column>
            </Card>
          ))}
        </Grid>
      </Box>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 1200,
  },
  heading: {
    marginBottom: 16,
  },
  card: {
    flex: 1,
    overflow: 'hidden',
  },
  icon: {
    opacity: 0.6,
  },
})
