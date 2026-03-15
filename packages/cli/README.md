# onlynative

CLI for adding [OnlyNative UI](https://github.com/onlynative/ui) components directly into your React Native or Expo project. Inspired by [shadcn/ui](https://ui.shadcn.com) — you own the code.

## Quick start

```bash
npx onlynative init
npx onlynative add button card
```

## How it works

Instead of installing components as an npm package, the CLI copies the source files into your project. You get full ownership — customize styles, adjust behavior, or remove what you don't need.

The theme system (`@onlynative/core`) stays as an npm dependency so theme updates propagate automatically.

## Requirements

- Node.js >= 18
- React Native >= 0.72 or Expo SDK >= 49
- TypeScript project (recommended)

## Commands

### `onlynative init`

Initialize your project for OnlyNative UI.

```bash
npx onlynative init
```

This will:

1. Detect your project type (Expo or bare React Native)
2. Detect your package manager (npm, yarn, pnpm, bun)
3. Detect path aliases from your `tsconfig.json`
4. Prompt for component and utility output directories
5. Install `@onlynative/core`
6. Create an `onlynative.json` config file

Options:

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip all prompts and use detected defaults |
| `--components-alias <alias>` | Components install path (default: `@/components/ui`) |
| `--lib-alias <alias>` | Utility files path (default: `@/lib`) |

Non-interactive mode for CI/automation:

```bash
# Accept all defaults
npx onlynative init -y

# With custom paths
npx onlynative init -y --components-alias "~/ui" --lib-alias "~/utils"
```

### `onlynative add <components...>`

Add one or more components to your project.

```bash
npx onlynative add button
npx onlynative add card chip text-field
npx onlynative add appbar  # auto-adds icon-button + typography dependencies
```

Options:

| Flag | Description |
|------|-------------|
| `-f, --force` | Overwrite existing components |
| `-d, --dry-run` | Preview what would be installed without writing files |

The `add` command:

1. Resolves the full dependency graph (e.g. `appbar` requires `icon-button` and `typography`)
2. Shows a plan of components, utilities, and npm packages to install
3. Copies component files with import paths rewritten to match your project
4. Generates a utility barrel file (`onlynative-utils.ts`)
5. Installs required npm dependencies

### `onlynative list`

Show all available components with their install status.

```bash
npx onlynative list
```

### `onlynative doctor`

Check your project for common issues.

```bash
npx onlynative doctor
```

Checks include:

- `onlynative.json` exists and is valid
- `@onlynative/core` is installed
- React Native version compatibility
- Installed component file integrity
- Peer dependencies (`react-native-safe-area-context`, `@expo/vector-icons`)

## Configuration

`onlynative init` creates an `onlynative.json` in your project root:

```json
{
  "$schema": "https://onlynative.dev/schema.json",
  "aliases": {
    "components": "@/components/ui",
    "lib": "@/lib"
  },
  "registryUrl": "https://raw.githubusercontent.com/onlynative/ui",
  "registryVersion": "main"
}
```

| Field | Description |
|-------|-------------|
| `aliases.components` | Where component directories are created |
| `aliases.lib` | Where utility files are placed |
| `registryUrl` | Base URL for fetching component source files |
| `registryVersion` | Git ref to fetch from (branch, tag, or commit) |

## Output structure

After running `npx onlynative add button appbar`:

```
src/
  components/
    ui/
      button/
        Button.tsx
        types.ts
        styles.ts
        index.ts
      icon-button/          # auto-added (appbar dependency)
        IconButton.tsx
        types.ts
        styles.ts
        index.ts
      typography/           # auto-added (appbar dependency)
        Typography.tsx
        types.ts
        index.ts
      appbar/
        AppBar.tsx
        types.ts
        styles.ts
        index.ts
  lib/
    color.ts
    elevation.ts
    icon.ts
    rtl.ts
    onlynative-utils.ts    # generated barrel
```

## Available components

| Component | Description |
|-----------|-------------|
| `typography` | Text component with 15 MD3 type scale variants |
| `button` | 5 variants (filled, elevated, outlined, text, tonal) with icon support |
| `icon-button` | 4 variants (filled, tonal, outlined, standard) with toggle support |
| `appbar` | Top app bar with 4 variants and SafeAreaView support |
| `card` | 3 variants (elevated, filled, outlined) with optional press handler |
| `chip` | 4 variants (assist, filter, input, suggestion) with icon/avatar support |
| `checkbox` | Binary selection control |
| `radio` | Single-choice selection control |
| `switch` | Toggle control with optional icons |
| `text-field` | Text input with animated floating label, 2 variants (filled, outlined) |
| `layout` | Layout primitives: Box, Row, Column, Grid, and SafeAreaView wrapper |
| `list` | List container with interactive items and dividers |
| `keyboard-avoiding-wrapper` | Zero-config keyboard-aware wrapper for form layouts |

## Import rewriting

The CLI rewrites imports so copied files work in your project:

| Original (library source) | Rewritten to |
|---------------------------|-------------|
| `@onlynative/core` | Unchanged (npm package) |
| `@onlynative/utils` | `@/lib/onlynative-utils` (local barrel) |
| `../icon-button` | `@/components/ui/icon-button` (alias path) |
| `./styles` | Unchanged (same directory) |

## Usage after adding components

```tsx
import { ThemeProvider } from '@onlynative/core'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function App() {
  return (
    <ThemeProvider>
      <Card>
        <Button variant="filled" onPress={() => {}}>
          Press me
        </Button>
      </Card>
    </ThemeProvider>
  )
}
```

## License

MIT
