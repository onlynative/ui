---
sidebar_position: 7
---

# Icons

OnlyNative components accept icons in three forms — a string name, a pre-rendered React element, or a render function. By default, string names resolve through `@expo/vector-icons/MaterialCommunityIcons`, but you can plug in **any** icon library (Lucide, SF Symbols, custom SVGs) globally via the theme's `iconResolver`, or per-call by passing an element/function.

This makes the library design-system agnostic: an Apple HIG app can use SF Symbols, a brand-driven app can ship custom SVGs, and an MD3 app gets MaterialCommunityIcons out of the box without any extra setup.

## The `IconSource` type

Every icon prop on every component (`leadingIcon`, `trailingIcon`, `icon`, `selectedIcon`, …) accepts an `IconSource`:

```ts
import type { IconSource } from '@onlynative/utils'

type IconSource =
  | string                                    // resolved via iconResolver (MCI by default)
  | ReactElement                              // pre-rendered icon — caller sizes/colors it
  | ((props: { size: number; color?: string }) => ReactNode) // render function
```

Pick the form that matches your situation:

| Form | When to use |
|------|-------------|
| **String** (`"check"`) | You're using MCI, or you've configured a global `iconResolver` that maps names. Easiest, theme-aware. |
| **ReactElement** (`<Check size={18} color="#fff" />`) | One-off icon from any library. You pass size and color yourself. |
| **Render function** (`({ size, color }) => <Check {...} />`) | Reusable wrapper that needs the component's resolved size and color. |

## Default — MaterialCommunityIcons

With no resolver configured, string names resolve to MaterialCommunityIcons. This is the zero-config path — install `@expo/vector-icons` and pass any [MCI name](https://pictogrammers.com/library/mdi/):

```tsx
import { Button, IconButton } from '@onlynative/components'

<Button leadingIcon="plus">Add</Button>
<IconButton icon="heart-outline" accessibilityLabel="Favorite" />
```

`@expo/vector-icons` is only required if you actually pass a string icon. The library imports it lazily — components render fine without it as long as you don't pass string icons.

## Per-call: pass any icon as a ReactElement

You don't need to configure anything to use a different icon library — just pass the element directly:

```tsx
import { Button } from '@onlynative/components'
import { Check, ArrowRight } from 'lucide-react-native'

<Button leadingIcon={<Check size={18} color="#fff" />}>
  Save
</Button>

<Button trailingIcon={<ArrowRight size={18} color="#fff" />}>
  Continue
</Button>
```

You're responsible for the size and color in this form — the component won't override what you pass.

## Per-call: pass a render function for theme-aware icons

If you want the icon to receive the **component's resolved size and color** (so it picks up `iconSize`, `contentColor`, disabled state, variant defaults, etc.), pass a function:

```tsx
import { Button } from '@onlynative/components'
import { Check } from 'lucide-react-native'

<Button leadingIcon={({ size, color }) => <Check size={size} color={color} />}>
  Save
</Button>
```

This is the form to use when you want consistent sizing/coloring without hard-coding values.

> **Note on component references.** Don't pass an icon component reference directly (`leadingIcon={Check}`) — wrap it in a function. The component reference would be called as a plain function, which bypasses React's hook rules.

## Global: configure an `iconResolver`

If you'd rather keep using string names but route them to a different library, register a resolver on `ThemeProvider`. This is the cleanest approach when one icon library powers your whole app.

```tsx
import { ThemeProvider } from '@onlynative/core'
import type { IconResolver } from '@onlynative/core'
import {
  Check,
  Plus,
  ArrowRight,
  Heart,
  HeartOff,
} from 'lucide-react-native'

const icons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  check: Check,
  plus: Plus,
  'arrow-right': ArrowRight,
  heart: Heart,
  'heart-outline': HeartOff,
}

const lucideResolver: IconResolver = (name, { size, color }) => {
  const Icon = icons[name]
  return Icon ? <Icon size={size} color={color} /> : null
}

export default function App() {
  return (
    <ThemeProvider iconResolver={lucideResolver}>
      {/* All string icon names now route through Lucide */}
    </ThemeProvider>
  )
}
```

Now any string name passed to a component flows through your resolver:

```tsx
<Button leadingIcon="check">Save</Button>
<IconButton icon="heart" accessibilityLabel="Like" />
```

You can return `null` from the resolver to render nothing for unknown names, or fall back to a default icon.

### SF Symbols on iOS (Apple HIG)

For Apple HIG-style apps, pair the resolver with [`expo-symbols`](https://docs.expo.dev/versions/latest/sdk/symbols/):

```tsx
import { ThemeProvider } from '@onlynative/core'
import type { IconResolver } from '@onlynative/core'
import { SymbolView } from 'expo-symbols'

const symbolMap: Record<string, string> = {
  check: 'checkmark',
  plus: 'plus',
  'arrow-right': 'arrow.right',
  heart: 'heart.fill',
  'heart-outline': 'heart',
}

const sfResolver: IconResolver = (name, { size, color }) => {
  const symbol = symbolMap[name]
  if (!symbol) return null
  return (
    <SymbolView
      name={symbol}
      size={size}
      tintColor={color}
      resizeMode="scaleAspectFit"
    />
  )
}

<ThemeProvider iconResolver={sfResolver}>
  {/* String names render as SF Symbols on iOS */}
</ThemeProvider>
```

`SymbolView` only renders on iOS — wrap the resolver in a platform check or a fallback library if you target Android/web too.

### Custom SVGs

Same pattern with `react-native-svg`:

```tsx
import { ThemeProvider } from '@onlynative/core'
import type { IconResolver } from '@onlynative/core'
import { CheckSvg, PlusSvg } from './my-icons'

const svgResolver: IconResolver = (name, { size, color }) => {
  if (name === 'check') return <CheckSvg width={size} height={size} fill={color} />
  if (name === 'plus') return <PlusSvg width={size} height={size} fill={color} />
  return null
}

<ThemeProvider iconResolver={svgResolver}>
  {/* String names render your SVGs */}
</ThemeProvider>
```

## Mixing forms

Per-call elements and functions always take precedence over the resolver — you can register a resolver for the common case and still drop in one-off icons:

```tsx
<ThemeProvider iconResolver={lucideResolver}>
  {/* Uses the resolver */}
  <Button leadingIcon="check">Save</Button>

  {/* Bypasses the resolver — explicit element wins */}
  <Button leadingIcon={<CustomBrandLogo size={18} />}>
    Branded action
  </Button>
</ThemeProvider>
```

## Components that use string icons internally

A few components render system icons of their own (for example, the checkmark inside a `Checkbox`, or the close button on an input `Chip`). Those names also flow through the configured `iconResolver`, so a Lucide-only resolver that doesn't map them will leave those icons missing.

The system names that components rely on:

| Component | System icon names |
|-----------|-------------------|
| `Checkbox` | `check` |
| `Chip` | `check` (filter, when selected), `close` (close button) |

You have two ways to handle this when adopting a custom resolver:

1. **Map the system names in your resolver.** Just include `check`, `close`, etc. alongside your other mappings — easiest path.
2. **Override per-component** with an explicit `IconSource`. `Checkbox` exposes a `checkIcon?: IconSource` prop for this:

```tsx
import { Checkbox } from '@onlynative/components'
import { Check } from 'lucide-react-native'

<Checkbox
  value={checked}
  checkIcon={({ size, color }) => <Check size={size} color={color} />}
  onValueChange={setChecked}
/>
```

## Sizing and color reference

Each component decides its own default icon size based on its variant or size prop. The values passed to your resolver / render function come from:

| Component | Source of `size` | Source of `color` |
|-----------|------------------|-------------------|
| `Button` | `iconSize` prop (default 18) | Resolved label color (variant default → `contentColor` → disabled treatment) |
| `IconButton` | Derived from `size` prop — small: 18, medium: 24, large: 28 | Variant + state default → `iconColor` → `contentColor` |

The `color` may be `undefined` when the component lets the icon library inherit from a parent text style — handle that in your resolver by passing it through unchanged, since most icon libraries treat `undefined` as "use the default".

## TypeScript

Types live in `@onlynative/core` (the resolver) and `@onlynative/utils` (`IconSource`):

```ts
import type { IconResolver, IconRenderProps } from '@onlynative/core'
import type { IconSource } from '@onlynative/utils'
```

Use these when you build wrapper components or shared resolvers.
