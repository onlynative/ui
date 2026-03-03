import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { Chip, Column, Row, Typography } from '@onlynative/components'

const variants = ['assist', 'filter', 'input', 'suggestion'] as const

export default function ChipScreen() {
  const [filters, setFilters] = useState<Record<string, boolean>>({
    Recent: true,
    Popular: false,
    Trending: false,
  })

  const toggleFilter = (key: string) =>
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Typography variant="headlineSmall">Chip Showcase</Typography>

      <Column gap="sm">
        <Typography variant="titleSmall">Variants</Typography>
        <Row wrap gap="sm">
          {variants.map((variant) => (
            <Chip key={variant} variant={variant}>
              {variant}
            </Chip>
          ))}
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">Elevated</Typography>
        <Row wrap gap="sm">
          <Chip variant="assist" elevated>
            Assist
          </Chip>
          <Chip variant="filter" elevated>
            Filter
          </Chip>
          <Chip variant="filter" elevated selected>
            Selected
          </Chip>
          <Chip variant="suggestion" elevated>
            Suggestion
          </Chip>
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">Filter Chips (Toggle)</Typography>
        <Row wrap gap="sm">
          {Object.entries(filters).map(([label, active]) => (
            <Chip
              key={label}
              variant="filter"
              selected={active}
              onPress={() => toggleFilter(label)}
              onClose={active ? () => toggleFilter(label) : undefined}
            >
              {label}
            </Chip>
          ))}
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">With Leading Icons</Typography>
        <Row wrap gap="sm">
          <Chip variant="assist" leadingIcon="calendar">
            Schedule
          </Chip>
          <Chip variant="suggestion" leadingIcon="lightbulb-outline">
            Idea
          </Chip>
          <Chip variant="input" leadingIcon="tag">
            Tagged
          </Chip>
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">Input Chips with Close</Typography>
        <Row wrap gap="sm">
          <Chip
            variant="input"
            onClose={() => Alert.alert('Removed', 'React Native')}
          >
            React Native
          </Chip>
          <Chip
            variant="input"
            leadingIcon="language-typescript"
            onClose={() => Alert.alert('Removed', 'TypeScript')}
          >
            TypeScript
          </Chip>
          <Chip
            variant="input"
            avatar={
              <View style={styles.avatar}>
                <Typography variant="labelSmall">JD</Typography>
              </View>
            }
            onClose={() => Alert.alert('Removed', 'John Doe')}
          >
            John Doe
          </Chip>
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">Disabled</Typography>
        <Row wrap gap="sm">
          {variants.map((variant) => (
            <Chip key={`disabled-${variant}`} variant={variant} disabled>
              {variant}
            </Chip>
          ))}
          <Chip variant="filter" selected disabled>
            Selected
          </Chip>
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">Custom Colors</Typography>
        <Row wrap gap="sm">
          <Chip containerColor="#B00020" contentColor="#FFFFFF">
            Danger
          </Chip>
          <Chip containerColor="#E8F5E9" contentColor="#2E7D32">
            Success
          </Chip>
          <Chip contentColor="#00796B">Teal</Chip>
        </Row>
      </Column>
    </ScrollView>
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
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8DEF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
