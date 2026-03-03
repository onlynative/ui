---
sidebar_position: 2
---

# Installation

## Prerequisites

- React Native 0.81+
- React 19+
- Expo SDK 54+ (if using Expo)

## Install packages

```bash
pnpm add @onlynative/core @onlynative/components
```

### Peer dependencies

`@onlynative/components` requires these peer dependencies:

```bash
pnpm add @expo/vector-icons react-native-safe-area-context
```

## Setup

Wrap your root component with `MaterialProvider`:

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

### With Expo Router

```tsx
// app/_layout.tsx
import { Slot } from 'expo-router'
import { MaterialProvider } from '@onlynative/core'

export default function RootLayout() {
  return (
    <MaterialProvider>
      <Slot />
    </MaterialProvider>
  )
}
```

## Importing Components

Each component has a dedicated subpath export for optimal tree-shaking:

```tsx
import { Button } from '@onlynative/components/button'
import { Card } from '@onlynative/components/card'
import { Typography } from '@onlynative/components/typography'
```

You can also import from the root entry, though subpath imports are preferred:

```tsx
import { Button, Card, Typography } from '@onlynative/components'
```
