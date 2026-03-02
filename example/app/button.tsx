import {
  Button,
  Column,
  IconButton,
  Row,
  Typography,
} from '@onlynative/components'
import { ScrollView, StyleSheet } from 'react-native'

const variants = ['filled', 'elevated', 'tonal', 'outlined', 'text'] as const
const iconVariants = [
  { label: 'Filled', value: 'filled' },
  { label: 'Tonal', value: 'tonal' },
  { label: 'Outlined', value: 'outlined' },
  { label: 'Standard', value: 'standard' },
] as const
const iconSizes = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
] as const

export default function ButtonScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Typography variant="headlineSmall">Button Showcase</Typography>

      <Column gap="sm">
        <Typography variant="titleSmall">Variants</Typography>
        <Row wrap gap="sm">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {`${variant} button`}
            </Button>
          ))}
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">Disabled Variants</Typography>
        <Row wrap gap="sm">
          {variants.map((variant) => (
            <Button key={`disabled-${variant}`} variant={variant} disabled>
              {`${variant} button`}
            </Button>
          ))}
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">Buttons: With Icons</Typography>
        <Row wrap gap="sm">
          <Button variant="filled" leadingIcon="plus">
            Add Item
          </Button>
          <Button variant="outlined" trailingIcon="arrow-right">
            Continue
          </Button>
          <Button
            variant="tonal"
            leadingIcon="heart-outline"
            trailingIcon="share-variant"
          >
            Favorite
          </Button>
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">Custom Colors</Typography>
        <Row wrap gap="sm">
          <Button containerColor="#B00020" contentColor="#FFFFFF">
            Danger
          </Button>
          <Button
            variant="outlined"
            contentColor="#00796B"
          >
            Teal Bold
          </Button>
          <Button
            variant="tonal"
            containerColor="#E8DEF8"
            contentColor="#4A148C"
          >
            Custom Tonal
          </Button>
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">IconButton: Variants</Typography>
        <Row gap="lg">
          {iconVariants.map((option) => (
            <Column key={option.value} align="center" gap="xs">
              <IconButton
                icon="heart-outline"
                variant={option.value}
                accessibilityLabel={`${option.label} heart`}
              />
              <Typography variant="labelSmall">{option.label}</Typography>
            </Column>
          ))}
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">IconButton: Sizes</Typography>
        <Row gap="lg">
          {iconSizes.map((option) => (
            <Column key={option.value} align="center" gap="xs">
              <IconButton
                icon="heart-outline"
                size={option.value}
                variant="standard"
                accessibilityLabel={`${option.label} heart`}
              />
              <Typography variant="labelSmall">{option.label}</Typography>
            </Column>
          ))}
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">IconButton: Custom Colors</Typography>
        <Row gap="sm">
          <IconButton
            icon="delete"
            containerColor="#B00020"
            contentColor="#FFFFFF"
            accessibilityLabel="Delete"
          />
          <IconButton
            icon="star"
            variant="outlined"
            contentColor="#FF8F00"
            accessibilityLabel="Star"
          />
          <IconButton
            icon="leaf"
            containerColor="#E8F5E9"
            contentColor="#2E7D32"
            accessibilityLabel="Eco"
          />
        </Row>
      </Column>

      <Column gap="sm">
        <Typography variant="titleSmall">IconButton: Toggle States</Typography>
        {iconVariants.map((option) => (
          <Column key={`state-${option.value}`} gap="xs">
            <Typography variant="labelSmall">{option.label}</Typography>
            <Row gap="lg">
              <Column align="center" gap="xs">
                <IconButton
                  icon="heart-outline"
                  selected={false}
                  variant={option.value}
                  accessibilityLabel="Like"
                />
                <Typography variant="labelSmall">Default</Typography>
              </Column>
              <Column align="center" gap="xs">
                <IconButton
                  icon="heart-outline"
                  selectedIcon="heart"
                  selected
                  variant={option.value}
                  accessibilityLabel="Like"
                />
                <Typography variant="labelSmall">Selected</Typography>
              </Column>
              <Column align="center" gap="xs">
                <IconButton
                  icon="heart-outline"
                  selected={false}
                  variant={option.value}
                  disabled
                  accessibilityLabel="Like"
                />
                <Typography variant="labelSmall">Disabled</Typography>
              </Column>
              <Column align="center" gap="xs">
                <IconButton
                  icon="heart-outline"
                  selectedIcon="heart"
                  selected
                  variant={option.value}
                  disabled
                  accessibilityLabel="Like"
                />
                <Typography variant="labelSmall">Sel + Dis</Typography>
              </Column>
            </Row>
          </Column>
        ))}
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
})
