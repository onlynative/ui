---
sidebar_position: 3
---

# Theming

OnlyNative UI follows the [Material Design 3 token structure](https://m3.material.io/foundations/design-tokens) for colors, typography, shape, spacing, elevation, motion, and state layers.

## MaterialProvider

Wrap your app with `MaterialProvider` to supply a theme to all components:

```tsx
import { MaterialProvider } from '@onlynative/core'

<MaterialProvider>
  {/* All components inside have access to the theme */}
</MaterialProvider>
```

Pass a custom theme to override the default light theme:

```tsx
import { MaterialProvider, darkTheme } from '@onlynative/core'

<MaterialProvider theme={darkTheme}>
  {/* Dark mode */}
</MaterialProvider>
```

## useTheme

Access the current theme in any component:

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

## Theme Structure

The `Theme` interface contains these token groups:

| Token Group | Description |
|-------------|-------------|
| `colors` | 47 MD3 color roles (primary, secondary, surface, error, etc.) |
| `typography` | 15 type scale variants (display, headline, title, body, label) |
| `shape` | Corner radius tokens (none through full) |
| `spacing` | Spacing scale (xs, sm, md, lg, xl) |
| `elevation` | Shadow levels 0–3 |
| `stateLayer` | Opacity values for pressed, focused, hovered, disabled states |
| `motion` | Duration and easing tokens for animations |

## Custom Theme

Create a custom theme by spreading the base theme and overriding tokens:

```tsx
import { lightTheme } from '@onlynative/core'
import type { Theme } from '@onlynative/core'

const customTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#006A6A',
    onPrimary: '#FFFFFF',
  },
}

<MaterialProvider theme={customTheme}>
  {/* Components use your custom colors */}
</MaterialProvider>
```
