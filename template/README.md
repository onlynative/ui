# OnlyNative Quickstart

A ready-to-use Expo project with [OnlyNative UI](https://github.com/onlynative/ui) pre-configured.

## Getting Started

The recommended way to create this project is via the CLI:

```bash
npx onlynative create
```

Or if you cloned this template directly:

```bash
npm install
npx expo start
```

Then press `i` for iOS, `a` for Android, or `w` for web.

## What's Included

- Expo SDK 54 with Expo Router
- `@onlynative/core` — Theme system with Material Design 3 tokens
- `@onlynative/components` — UI components (Button, Card, Typography, and more)
- ThemeProvider already wired up in the root layout
- Example home screen with Buttons and Cards

## Project Structure

```
app/
├── _layout.tsx       # Root layout with ThemeProvider
└── index.tsx         # Home screen with example components
assets/               # App icons and splash screen
app.json              # Expo config
package.json
tsconfig.json
```

## Learn More

- [Quick Start Guide](https://onlynative.github.io/ui/quick-start)
- [OnlyNative Docs](https://onlynative.github.io/ui)
- [Component API Reference](https://onlynative.github.io/ui/llms-full.txt)
- [GitHub](https://github.com/onlynative/ui)
