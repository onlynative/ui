# @onlynative/core

Design-system agnostic theme engine for [OnlyNative UI](https://github.com/onlynative/ui) — a React Native component library. Ships with Material Design 3 out of the box.

## Install

```bash
pnpm add @onlynative/core
```

Peer dependencies: `react >=19`, `react-native >=0.81`

## Quick start (Material Design 3)

Wrap your app root with `ThemeProvider`:

```tsx
import { ThemeProvider } from '@onlynative/core'

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app */}
    </ThemeProvider>
  )
}
```

## API

### ThemeProvider

Provides the theme context to all child components. Works with any design system — Material Design 3, Apple HIG, or custom themes. Defaults to the MD3 light theme.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `BaseTheme` | `lightTheme` (MD3) | Theme object |
| `children` | `ReactNode` | — | App content |

### useTheme()

Returns the current theme from the nearest provider.

```tsx
import { useTheme } from '@onlynative/core'

// MD3 (default)
const theme = useTheme()

// Custom design system
const theme = useTheme<MyTheme>()
```

### defineTheme(theme)

Type-safe helper for creating custom themes:

```tsx
import { defineTheme } from '@onlynative/core'
import type { BaseTheme } from '@onlynative/core'

const myTheme = defineTheme({
  colors: { brand: '#FF6B00', background: '#FFF', text: '#1A1A1A' },
  typography: { heading: { ... }, body: { ... } },
  shape: { ... },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  stateLayer: { ... },
  elevation: { ... },
  motion: { ... },
})
```

### createMaterialTheme(seedColor)

Generates a complete MD3 light and dark theme from a single seed color using Google's HCT color space:

```tsx
import { createMaterialTheme, ThemeProvider } from '@onlynative/core'

const { lightTheme, darkTheme } = createMaterialTheme('#006A6A')

<ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
```

### material preset

Grouped object with all MD3 theme values:

```tsx
import { material } from '@onlynative/core'

material.lightTheme
material.darkTheme
material.defaultTopAppBarTokens
material.createMaterialTheme
```

### apple preset

Grouped object with all Apple HIG theme values:

```tsx
import { apple } from '@onlynative/core'

apple.lightTheme
apple.darkTheme
apple.typography
apple.createComponentTheme  // maps Apple colors to MD3 for components
```

Use with `ThemeProvider` and `useTheme<AppleTheme>()`:

```tsx
import { ThemeProvider, appleLightTheme } from '@onlynative/core'
import type { AppleTheme } from '@onlynative/core'

<ThemeProvider theme={appleLightTheme}>{children}</ThemeProvider>

const theme = useTheme<AppleTheme>()
// theme.colors.tint, theme.colors.systemBackground, theme.typography.body, etc.
```

### createAppleComponentTheme(appleTheme)

Maps Apple HIG colors to MD3 color roles so existing components (Button, Card, etc.) work with Apple-sourced colors:

```tsx
import { createAppleComponentTheme, appleLightTheme, ThemeProvider } from '@onlynative/core'

const theme = createAppleComponentTheme(appleLightTheme)

<ThemeProvider theme={theme}>{children}</ThemeProvider>
```

### Theme type hierarchy

- `BaseTheme` — Generic base. Colors as `Record<string, string>`, typography as `Record<string, TextStyle>`, plus shape, spacing, stateLayer, elevation, motion.
- `Theme` / `MaterialTheme` — MD3 theme. Extends `BaseTheme` with 69 color roles, 15 typography variants, optional `topAppBar` tokens.
- `AppleTheme` — Apple HIG theme. Extends `BaseTheme` with 38 color roles (system colors, labels, backgrounds, fills, separators), 11 typography variants (SF Pro scale).

### Theme structure

| Token group | Description |
|-------------|-------------|
| `colors` | Design-system specific color roles (`Record<string, string>`) |
| `typography` | Type scale variants (`Record<string, TextStyle>`) |
| `shape` | Corner radius tokens (none through full) |
| `spacing` | Spacing scale (xs, sm, md, lg, xl) |
| `elevation` | Shadow levels 0–3 |
| `stateLayer` | Opacity values for pressed, focused, hovered, disabled |
| `motion` | Duration and easing tokens |

### Custom MD3 theme

```tsx
import { lightTheme } from '@onlynative/core'
import type { Theme } from '@onlynative/core'

const custom: Theme = {
  ...lightTheme,
  colors: { ...lightTheme.colors, primary: '#006A6A', onPrimary: '#FFFFFF' },
}

<ThemeProvider theme={custom}>{children}</ThemeProvider>
```

### Dark theme

```tsx
import { ThemeProvider, darkTheme } from '@onlynative/core'

<ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
```

### useBreakpoint()

Returns the current MD3 window size class: `'compact'` | `'medium'` | `'expanded'` | `'large'` | `'extraLarge'`.

### useBreakpointValue(values)

Returns a value based on the current breakpoint with cascade fallback.

```tsx
const columns = useBreakpointValue({ compact: 1, medium: 2, expanded: 4 })
```

## Exports

- `ThemeProvider` — Theme context provider (works with any design system, defaults to MD3)
- `MaterialProvider` — Deprecated alias for `ThemeProvider`
- `useTheme` — Access current theme (generic)
- `defineTheme` — Type-safe theme creation helper
- `createMaterialTheme` — Generate MD3 themes from a seed color
- `material` — MD3 preset object (`lightTheme`, `darkTheme`, `defaultTopAppBarTokens`, `createMaterialTheme`)
- `apple` — Apple HIG preset object (`lightTheme`, `darkTheme`, `typography`, `createComponentTheme`)
- `appleLightTheme` / `appleDarkTheme` — Built-in Apple HIG themes
- `appleTypography` — SF Pro typography scale
- `createAppleComponentTheme` — Map Apple colors to MD3 for component compatibility
- `useBreakpoint` — Current window size class
- `useBreakpointValue` — Responsive values
- `lightTheme` / `darkTheme` — Built-in MD3 themes
- `BaseTheme`, `Theme`, `MaterialTheme`, `AppleTheme`, `AppleColors`, `AppleTypography`, `Colors`, `Typography`, `Shape`, `Spacing`, `Elevation`, `StateLayer`, `Motion` — Types

## Docs

https://onlynative.github.io/ui/

## License

MIT
