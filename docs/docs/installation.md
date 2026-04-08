---
sidebar_position: 3
---

# Installation

## Prerequisites

- React Native 0.81+
- React 19+
- Expo SDK 54+ (if using Expo)

## Install packages

<PackageManagerTabs cmd="npm install @onlynative/core @onlynative/components" />

### Peer dependencies

`@onlynative/components` requires this peer dependency:

<PackageManagerTabs cmd="npm install react-native-safe-area-context" />

If you use icon props (`leadingIcon`, `trailingIcon`, `icon` on Button, IconButton, Chip, etc.), also install:

<PackageManagerTabs cmd="npm install @expo/vector-icons" />

## Setup

Wrap your root component with `ThemeProvider`:

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

### With Expo Router

```tsx
// app/_layout.tsx
import { Slot } from 'expo-router'
import { ThemeProvider } from '@onlynative/core'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
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
