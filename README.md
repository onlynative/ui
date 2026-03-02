# OnlyNative UI

![Node >=18](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![pnpm 9](https://img.shields.io/badge/pnpm-9.x-F69220?logo=pnpm&logoColor=white)
![Expo SDK 54](https://img.shields.io/badge/expo-54-000020?logo=expo&logoColor=white)
![Monorepo](https://img.shields.io/badge/monorepo-turbo-EF4444)

Material Design 3 component library for React Native, built as a `pnpm` + `Turborepo` workspace.

## Packages

| Package | Purpose |
| --- | --- |
| `@onlynative/core` | Theme contracts, theme values, context provider, `useTheme`. |
| `@onlynative/components` | UI components and subpath exports. |
| `example` | Demo app showing component behavior and API usage. |

## Repository Layout

```text
.
├─ example/                # Expo Router showcase app
├─ packages/
│  ├─ core/                # Theme + provider primitives
│  └─ components/          # Reusable UI component package
├─ turbo.json
└─ pnpm-workspace.yaml
```

## Requirements

- Node.js `>=18`
- `pnpm@9` (configured in `packageManager`)

## Quick Start

```bash
pnpm install
pnpm run example
```

Run on a specific platform:

```bash
pnpm --filter example ios
pnpm --filter example android
pnpm --filter example web
```

## Usage Example

```tsx
import { MaterialProvider, lightTheme } from '@onlynative/core'
import { Button, Typography } from '@onlynative/components'

export function Screen() {
  return (
    <MaterialProvider theme={lightTheme}>
      <Typography variant="headlineSmall">Hello UI</Typography>
      <Button variant="filled">Press me</Button>
    </MaterialProvider>
  )
}
```

## Workspace Commands

| Command | Description |
| --- | --- |
| `pnpm run build` | Builds all packages with Turborepo. |
| `pnpm run dev` | Runs package `dev` tasks via Turborepo (persistent, uncached). |
| `pnpm run typecheck` | Type-checks all packages with `tsc --noEmit`. |
| `pnpm run lint` | Lints `example` and `packages`. |
| `pnpm run test` | Runs package `test` tasks if defined. |
| `pnpm run format` | Formats the repository with Prettier. |
| `pnpm run clean` | Cleans build outputs via Turborepo. |
| `pnpm run example` | Starts the Expo example app. |

Package-level build commands:

```bash
pnpm --filter @onlynative/core build
pnpm --filter @onlynative/components build
```

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contribution guide: [`CONTRIBUTING.md`](CONTRIBUTING.md)
