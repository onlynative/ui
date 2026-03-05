# @onlynative/core

Design-system agnostic theme engine for [OnlyNative UI](https://github.com/onlynative/ui) — a React Native component library. Ships with Material Design 3 out of the box.

## Install

```bash
pnpm add @onlynative/core
```

Peer dependencies: `react >=19`, `react-native >=0.81`

## Quick start (Material Design 3)

Wrap your app root with `MaterialProvider`:

```tsx
import { MaterialProvider } from '@onlynative/core'

export default function App() {
  return (
    <MaterialProvider>
      {/* Your app */}
    </MaterialProvider>
  )
}
```

## API

### MaterialProvider

Provides the MD3 theme context to all child components.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `Theme` | `lightTheme` | MD3 theme object |
| `children` | `ReactNode` | — | App content |

### ThemeProvider

Generic provider for custom design systems. Accepts any theme extending `BaseTheme`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `BaseTheme` | — | Custom theme object (required) |
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

### material preset

Grouped object with all MD3 theme values:

```tsx
import { material } from '@onlynative/core'

material.lightTheme
material.darkTheme
material.defaultTopAppBarTokens
```

### Theme type hierarchy

- `BaseTheme` — Generic base. Colors as `Record<string, string>`, typography as `Record<string, TextStyle>`, plus shape, spacing, stateLayer, elevation, motion.
- `Theme` / `MaterialTheme` — MD3 theme. Extends `BaseTheme` with 69 color roles, 15 typography variants, optional `topAppBar` tokens.

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

<MaterialProvider theme={custom}>{children}</MaterialProvider>
```

### Dark theme

```tsx
import { MaterialProvider, darkTheme } from '@onlynative/core'

<MaterialProvider theme={darkTheme}>{children}</MaterialProvider>
```

### useBreakpoint()

Returns the current MD3 window size class: `'compact'` | `'medium'` | `'expanded'` | `'large'` | `'extraLarge'`.

### useBreakpointValue(values)

Returns a value based on the current breakpoint with cascade fallback.

```tsx
const columns = useBreakpointValue({ compact: 1, medium: 2, expanded: 4 })
```

## Exports

- `MaterialProvider` — MD3 theme context provider
- `ThemeProvider` — Generic theme context provider
- `useTheme` — Access current theme (generic)
- `defineTheme` — Type-safe theme creation helper
- `material` — MD3 preset object (`lightTheme`, `darkTheme`, `defaultTopAppBarTokens`)
- `useBreakpoint` — Current window size class
- `useBreakpointValue` — Responsive values
- `lightTheme` / `darkTheme` — Built-in MD3 themes
- `BaseTheme`, `Theme`, `MaterialTheme`, `Colors`, `Typography`, `Shape`, `Spacing`, `Elevation`, `StateLayer`, `Motion` — Types

## Docs

https://onlynative.github.io/ui/

## License

MIT
