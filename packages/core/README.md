# @onlynative/core

Theme system for [OnlyNative UI](https://github.com/onlynative/ui) — a Material Design 3 component library for React Native.

## Install

```bash
pnpm add @onlynative/core
```

Peer dependencies: `react >=19`, `react-native >=0.81`

## Setup

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

Provides theme context to all child components.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `Theme` | `lightTheme` | Theme object |
| `children` | `ReactNode` | — | App content |

### useTheme()

Returns the current `Theme` from the nearest provider.

```tsx
import { useTheme } from '@onlynative/core'

const theme = useTheme()
// theme.colors, theme.typography, theme.spacing, theme.shape, etc.
```

### Theme structure

| Token group | Description |
|-------------|-------------|
| `colors` | 47 MD3 color roles (primary, secondary, surface, error, etc.) |
| `typography` | 15 type scale variants (displayLarge through labelSmall) |
| `shape` | Corner radius tokens (none through full) |
| `spacing` | Spacing scale (xs, sm, md, lg, xl) |
| `elevation` | Shadow levels 0–3 |
| `stateLayer` | Opacity values for pressed, focused, hovered, disabled |
| `motion` | Duration and easing tokens |

### Custom theme

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

- `MaterialProvider` — Theme context provider
- `useTheme` — Access current theme
- `useBreakpoint` — Current window size class
- `useBreakpointValue` — Responsive values
- `lightTheme` / `darkTheme` — Built-in themes
- `Theme`, `Colors`, `Typography`, `Shape`, `Spacing`, `Elevation`, `StateLayer`, `Motion` — Types

## Docs

https://onlynative.github.io/ui/

## License

MIT
