---
sidebar_position: 3
---

# Theming

OnlyNative UI ships with Material Design 3 out of the box, but the theme engine is design-system agnostic — you can customize MD3, generate branded themes from a seed color, or build an entirely custom design system.

## Material Design 3 (default)

### ThemeProvider

Wrap your app with `ThemeProvider` to supply the MD3 theme:

```tsx
import { ThemeProvider } from '@onlynative/core'

export default function App() {
  return (
    <ThemeProvider>
      {/* All components use the default light theme */}
    </ThemeProvider>
  )
}
```

### Dark mode

Pass the built-in dark theme:

```tsx
import { ThemeProvider, darkTheme } from '@onlynative/core'

<ThemeProvider theme={darkTheme}>
  {/* Dark mode */}
</ThemeProvider>
```

Switch between light and dark based on system preference:

```tsx
import { useColorScheme } from 'react-native'
import { ThemeProvider, lightTheme, darkTheme } from '@onlynative/core'

export default function App() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeProvider theme={theme}>
      {/* Follows system theme */}
    </ThemeProvider>
  )
}
```

### Override specific tokens

Spread the base theme and override individual tokens:

```tsx
import { lightTheme } from '@onlynative/core'
import type { Theme } from '@onlynative/core'

const brandTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#006A6A',
    onPrimary: '#FFFFFF',
  },
}

<ThemeProvider theme={brandTheme}>
  {/* Components use your custom primary color */}
</ThemeProvider>
```

### Generate a theme from a seed color

`createMaterialTheme` generates a complete MD3 light and dark theme from a single hex color using Google's HCT color space. All 69 color roles are derived automatically:

```tsx
import { createMaterialTheme, ThemeProvider } from '@onlynative/core'

const { lightTheme, darkTheme } = createMaterialTheme('#006A6A')

<ThemeProvider theme={lightTheme}>
  {/* Full MD3 palette generated from #006A6A */}
</ThemeProvider>
```

This is the easiest way to create a branded theme — pick your brand color and the entire palette is generated for you.

### Access theme values

Use the `useTheme` hook in any component:

```tsx
import { useTheme } from '@onlynative/core'

function MyComponent() {
  const theme = useTheme()
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.onSurface }}>Hello</Text>
    </View>
  )
}
```

### Material preset

All MD3 values are also available as a grouped object:

```tsx
import { material } from '@onlynative/core'

material.lightTheme
material.darkTheme
material.defaultTopAppBarTokens
material.createMaterialTheme
```

## Custom design systems

The theme engine supports any design system, not just MD3. Use `BaseTheme`, `defineTheme`, and `ThemeProvider` to build your own.

### BaseTheme

All themes extend `BaseTheme`:

```tsx
interface BaseTheme {
  colors: Record<string, string>
  typography: Record<string, TextStyle>
  shape: Shape
  spacing: Spacing
  stateLayer: StateLayer
  elevation: Elevation
  motion: Motion
}
```

### Define a custom theme

Use `defineTheme` for type-safe theme creation:

```tsx
import { defineTheme } from '@onlynative/core'
import type { BaseTheme } from '@onlynative/core'

interface BrandTheme extends BaseTheme {
  colors: {
    brand: string
    brandMuted: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    error: string
    success: string
    [key: string]: string
  }
  typography: {
    heading: TextStyle
    subheading: TextStyle
    body: TextStyle
    caption: TextStyle
    [key: string]: TextStyle
  }
}

const brandTheme = defineTheme<BrandTheme>({
  colors: {
    brand: '#FF6B00',
    brandMuted: '#FFF3E0',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#1A1A1A',
    textSecondary: '#757575',
    border: '#E0E0E0',
    error: '#D32F2F',
    success: '#388E3C',
  },
  typography: {
    heading: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
    subheading: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  },
  shape: { none: 0, extraSmall: 4, small: 8, medium: 12, large: 16, extraLarge: 28, full: 9999 },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  stateLayer: { pressed: 0.12, focused: 0.12, hovered: 0.08, disabled: 0.38 },
  elevation: {
    level0: {},
    level1: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 1 },
    level2: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
    level3: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  },
  motion: {
    duration: { short: 100, medium: 300, long: 500 },
    easing: { standard: 'ease-in-out', accelerate: 'ease-in', decelerate: 'ease-out' },
  },
})
```

### ThemeProvider

Use `ThemeProvider` for custom design systems:

```tsx
import { ThemeProvider } from '@onlynative/core'

<ThemeProvider theme={brandTheme}>
  {/* Your app */}
</ThemeProvider>
```

### Access custom theme values

Pass your theme type as a generic to `useTheme`:

```tsx
import { useTheme } from '@onlynative/core'

function MyComponent() {
  const theme = useTheme<BrandTheme>()
  // theme.colors.brand is typed as string
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={[theme.typography.body, { color: theme.colors.text }]}>
        Hello
      </Text>
    </View>
  )
}
```

## Theme structure reference

| Token group | Description |
|-------------|-------------|
| `colors` | Design-system specific color roles (`Record<string, string>`) |
| `typography` | Type scale variants (`Record<string, TextStyle>`) |
| `shape` | Corner radius tokens (none through full) |
| `spacing` | Spacing scale (xs, sm, md, lg, xl) |
| `elevation` | Shadow levels 0-3 |
| `stateLayer` | Opacity values for pressed, focused, hovered, disabled |
| `motion` | Duration and easing tokens |

## Apple HIG preset

OnlyNative UI includes a built-in Apple Human Interface Guidelines theme with iOS/macOS system colors and SF Pro typography.

### Setup

```tsx
import { ThemeProvider, appleLightTheme } from '@onlynative/core'

<ThemeProvider theme={appleLightTheme}>
  {/* Your app */}
</ThemeProvider>
```

### Dark mode

```tsx
import { useColorScheme } from 'react-native'
import { ThemeProvider, appleLightTheme, appleDarkTheme } from '@onlynative/core'

export default function App() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? appleDarkTheme : appleLightTheme

  return (
    <ThemeProvider theme={theme}>
      {/* Follows system theme */}
    </ThemeProvider>
  )
}
```

### Access Apple theme values

```tsx
import { useTheme } from '@onlynative/core'
import type { AppleTheme } from '@onlynative/core'

function MyComponent() {
  const theme = useTheme<AppleTheme>()
  return (
    <View style={{ backgroundColor: theme.colors.systemBackground }}>
      <Text style={[theme.typography.body, { color: theme.colors.label }]}>
        Hello
      </Text>
    </View>
  )
}
```

### Apple preset

All Apple HIG values are available as a grouped object:

```tsx
import { apple } from '@onlynative/core'

apple.lightTheme
apple.darkTheme
apple.typography
apple.createComponentTheme
```

### Use Apple colors with MD3 components

The built-in components (Button, Card, etc.) are designed for Material Design 3 color roles. To use them with Apple colors, use `createAppleComponentTheme` to create an MD3-compatible theme from your Apple theme:

```tsx
import { createAppleComponentTheme, appleLightTheme, ThemeProvider } from '@onlynative/core'

const theme = createAppleComponentTheme(appleLightTheme)

<ThemeProvider theme={theme}>
  {/* Button, Card, etc. now use Apple-sourced colors */}
</ThemeProvider>
```

This maps Apple roles to MD3 equivalents (e.g. `tint` becomes `primary`, `label` becomes `onSurface`, `systemRed` becomes `error`).

### Color roles

The Apple theme includes semantic UI colors (`label`, `secondaryLabel`, `systemBackground`, `separator`, `systemFill`, etc.) and all 13 system colors (`systemRed`, `systemBlue`, `systemGreen`, etc.) plus 6 gray levels.

### Typography scale

11 text styles following SF Pro conventions: `largeTitle` (34pt), `title1` (28pt), `title2` (22pt), `title3` (20pt), `headline` (17pt semibold), `body` (17pt), `callout` (16pt), `subheadline` (15pt), `footnote` (13pt), `caption1` (12pt), `caption2` (11pt).

## Type hierarchy

- **`BaseTheme`** — Generic base. Any design system extends this.
- **`Theme` / `MaterialTheme`** — MD3 theme. Extends `BaseTheme` with 69 color roles, 15 typography variants, optional `topAppBar` tokens.
- **`AppleTheme`** — Apple HIG theme. Extends `BaseTheme` with 38 color roles, 11 typography variants.

## Summary

| Goal | API |
|------|-----|
| Use MD3 defaults | `<ThemeProvider>` |
| Dark mode | `<ThemeProvider theme={darkTheme}>` |
| Override a few MD3 colors | Spread `lightTheme` and override |
| Branded MD3 theme from one color | `createMaterialTheme('#hex')` |
| Apple HIG theme | `<ThemeProvider theme={appleLightTheme}>` + `useTheme<AppleTheme>()` |
| Fully custom design system | `defineTheme` + `<ThemeProvider>` + `useTheme<T>()` |
