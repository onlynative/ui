# OnlyNative UI

[![Node >=18](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm 9](https://img.shields.io/badge/pnpm-9.x-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Expo SDK 54](https://img.shields.io/badge/expo-54-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Turborepo](https://img.shields.io/badge/monorepo-turbo-EF4444)](https://turbo.build/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Design system agnostic component library for React Native**, built as a pnpm + Turborepo monorepo. Ships with a Material Design You theme out of the box — or bring your own design system using the pluggable theme engine.

> [Documentation](https://onlynative.github.io/ui/) &nbsp;|&nbsp; [Live Demo](https://onlynative.github.io/ui/demo/) &nbsp;|&nbsp; [GitHub](https://github.com/onlynative/ui)

## Try it on your device

Scan the QR code with the [Expo Go](https://expo.dev/go) app to preview components on your device:


<img
  src="https://qr.expo.dev/eas-update?projectId=9bc1e6dd-2f68-433d-813a-4e4bd167298b&runtimeVersion=0.0.0&channel=main"
  alt="Expo Preview QR Code"
  width="200"
  height="200"
/>

## Features

- Pluggable theme engine — use the built-in Material Design You theme or create your own design system
- Token-based theming (colors, typography, shape, spacing, elevation, motion, state)
- Light and dark themes out of the box
- Responsive breakpoint utilities (`useBreakpoint`, `useBreakpointValue`)
- Subpath exports for tree-shaking (`@onlynative/components/button`, etc.)
- Accessible by default (`role`, `accessibilityLabel`, `accessibilityState`)
- State-layer press/hover/focus feedback
- TypeScript-first with strict mode

## Installation

```bash
# Install the core theme package
yarn add @onlynative/core

# Install the component library
yarn add @onlynative/components
```

**Peer dependencies** — make sure these are installed in your project:

```bash
npx expo install react react-native @expo/vector-icons react-native-safe-area-context
```

## Quick Start

Wrap your app with `ThemeProvider` and start using components:

```tsx
import { ThemeProvider, lightTheme } from '@onlynative/core'
import { Button, Typography } from '@onlynative/components'

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Typography variant="headlineSmall">Hello UI</Typography>
      <Button variant="filled">Press me</Button>
    </ThemeProvider>
  )
}
```

You can also import individual components via subpath exports:

```tsx
import { Button } from '@onlynative/components/button'
import { Card } from '@onlynative/components/card'
```

## Packages

| Package | Size | Description |
| --- | --- | --- |
| [`@onlynative/core`](packages/core) | ![npm bundle size](https://img.shields.io/bundlephobia/min/@onlynative/core) | Theme engine, theme contracts, built-in Material Design You theme, `ThemeProvider`, `useTheme` hook, responsive utilities. |
| [`@onlynative/components`](packages/components) | ![npm bundle size](https://img.shields.io/bundlephobia/min/@onlynative/components) | UI components with subpath exports for tree-shaking. |
| [`example`](example) | — | Expo Router showcase app for testing and previewing components. |
| [`docs`](docs) | — | Docusaurus documentation site. |

## Repository Layout

```text
.
├── docs/                  # Docusaurus documentation site
├── example/               # Expo Router showcase app
├── packages/
│   ├── core/              # Theme + provider primitives
│   └── components/        # Reusable UI component library
├── turbo.json
└── pnpm-workspace.yaml
```

## Development

### Requirements

- Node.js `>=18`
- pnpm `9.x`

### Setup

```bash
pnpm install
```

### Commands

| Command | Description |
| --- | --- |
| `pnpm run build` | Build all packages with Turborepo |
| `pnpm run typecheck` | Type-check all packages (`tsc --noEmit`) |
| `pnpm run lint` | ESLint across example and packages |
| `pnpm run test` | Run tests across all packages |
| `pnpm run format` | Format with Prettier |
| `pnpm run example` | Start the Expo example app |
| `pnpm run clean` | Clean build outputs |
| `pnpm run docs:dev` | Start documentation dev server |

### Running the Example App

```bash
pnpm run example            # Start Expo dev server

# Or target a specific platform
pnpm --filter example ios
pnpm --filter example android
pnpm --filter example web
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | React 19.1, React Native 0.81.5, Expo SDK 54 |
| Language | TypeScript 5 (strict mode) |
| Build | tsup (package bundling), Turborepo (task orchestration) |
| Package Manager | pnpm 9 (workspace protocol) |
| Testing | Jest 29, @testing-library/react-native |
| Documentation | Docusaurus 3 |

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
