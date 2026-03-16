---
sidebar_position: 7
---

# Migrating to OnlyNative UI

OnlyNative UI is a Material Design 3 component library for React Native with a copy-paste CLI workflow (like shadcn/ui). Components are added to your project via `onlynative add` — you own the source code and can customize freely.

This guide maps components and props from popular React Native UI libraries to their OnlyNative equivalents.

## Common Steps

Regardless of which library you're migrating from:

1. Install the core package and wrap your app with `ThemeProvider`:

```tsx
import { ThemeProvider } from '@onlynative/core'

export default function App() {
  return <ThemeProvider>{/* your app */}</ThemeProvider>
}
```

2. Add components one at a time using the CLI:

```bash
npx onlynative add button card text-field
```

3. Replace imports incrementally — OnlyNative uses subpath imports:

```tsx
import { Button } from '@onlynative/components/button'
import { TextField } from '@onlynative/components/text-field'
import { Card } from '@onlynative/components/card'
```

4. OnlyNative components use a consistent override pattern:
   - `containerColor` — background color (state-layer colors auto-derived)
   - `contentColor` — label + icon color
   - `labelStyle` — text-specific overrides
   - `style` — root container style

---

## From React Native Paper

Paper and OnlyNative are both MD3-based, making this the most straightforward migration.

### Theme Migration

```tsx
// Before (Paper)
import { MD3LightTheme, PaperProvider } from 'react-native-paper'

<PaperProvider theme={MD3LightTheme}>

// After (OnlyNative)
import { ThemeProvider, lightTheme } from '@onlynative/core'

<ThemeProvider theme={lightTheme}>
```

Both use the same MD3 color token names (`primary`, `onPrimary`, `surface`, `surfaceContainer`, etc.), so custom theme color objects are largely portable. Replace `useTheme()` from `react-native-paper` with `useTheme()` from `@onlynative/core`.

For custom themes, replace Paper's theme spreading with `defineTheme()`:

```tsx
// Before (Paper)
const theme = { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: '#6750A4' } }

// After (OnlyNative)
import { defineTheme } from '@onlynative/core'
const theme = defineTheme({ ...lightTheme, colors: { ...lightTheme.colors, primary: '#6750A4' } })

// Or generate a full theme from a seed color
import { createMaterialTheme } from '@onlynative/core/create-theme'
const { lightTheme, darkTheme } = createMaterialTheme('#6750A4')
```

### Component Mapping

| React Native Paper | OnlyNative | Notes |
|---|---|---|
| `<PaperProvider>` | `<ThemeProvider>` | From `@onlynative/core` |
| `<Button>` | `<Button>` | `mode` becomes `variant` |
| `<IconButton>` | `<IconButton>` | |
| `<Appbar>` / `<Appbar.Header>` | `<AppBar>` | Single component, not compound |
| `<Card>` / `<Card.Content>` / `<Card.Title>` | `<Card>` | Flat children, no subcomponents |
| `<Chip>` | `<Chip>` | Same variant model |
| `<Checkbox>` | `<Checkbox>` | `status` string becomes `value` boolean |
| `<RadioButton>` | `<Radio>` | Renamed |
| `<Switch>` | `<Switch>` | Nearly identical |
| `<TextInput>` | `<TextField>` | `mode` becomes `variant` |
| `<Text>` | `<Typography>` | Same MD3 variant scale |
| `<Surface>` | `<Box>` or `<Card>` | Use Box for layout, Card for interactive |
| `<List.Item>` | `<ListItem>` | Flat import, not compound |
| `<Divider>` | `<ListDivider>` | |
| `<FAB>` | — | Not yet available |
| `<Dialog>` | — | Not yet available |
| `<Menu>` | — | Not yet available |
| `<Snackbar>` | — | Not yet available |
| `<SegmentedButtons>` | — | Not yet available |

### Key Prop Changes

**Button:**

| Paper | OnlyNative | Notes |
|---|---|---|
| `mode="contained"` | `variant="filled"` | |
| `mode="contained-tonal"` | `variant="tonal"` | |
| `mode="outlined"` | `variant="outlined"` | Same |
| `mode="text"` | `variant="text"` | Same |
| `mode="elevated"` | `variant="elevated"` | Same |
| `icon="plus"` | `leadingIcon="plus"` | Supports leading + trailing |
| `buttonColor` | `containerColor` | |
| `textColor` | `contentColor` | Also affects icons |
| `labelStyle` | `labelStyle` | Same |
| `contentStyle` | `style` | |
| `uppercase` | Use `labelStyle={{ textTransform: 'uppercase' }}` | |

**TextInput:**

| Paper | OnlyNative | Notes |
|---|---|---|
| `mode="outlined"` | `variant="outlined"` | Same |
| `mode="flat"` | `variant="filled"` | Renamed |
| `label` | `label` | Same |
| `error` | `error` | Same |
| `left={<TextInput.Icon icon="eye" />}` | `leadingIcon="eye"` | String-based |
| `right={<TextInput.Icon icon="close" />}` | `trailingIcon="close"` | String-based |

**Card:**

| Paper | OnlyNative | Notes |
|---|---|---|
| `mode="elevated"` | `variant="elevated"` | Same |
| `mode="contained"` | `variant="filled"` | Renamed |
| `mode="outlined"` | `variant="outlined"` | Same |
| `<Card.Content>` wrapper | Direct children | No wrapper needed |
| `onPress` | `onPress` | Same |

**Checkbox:**

| Paper | OnlyNative | Notes |
|---|---|---|
| `status="checked"` | `value={true}` | Boolean instead of string |
| `status="unchecked"` | `value={false}` | |
| `onPress` | `onValueChange` | Receives boolean value |
| `color` | `containerColor` | |
| `uncheckedColor` | `contentColor` | |

---

## From NativeBase / Gluestack UI

NativeBase uses utility props for styling. OnlyNative uses standard React Native `style` props with theme-aware spacing shortcuts on layout components.

### Theme Migration

```tsx
// Before (NativeBase)
import { NativeBaseProvider, extendTheme } from 'native-base'
const theme = extendTheme({ colors: { primary: { 500: '#6750A4' } } })
<NativeBaseProvider theme={theme}>

// After (OnlyNative)
import { ThemeProvider, defineTheme, lightTheme } from '@onlynative/core'
const theme = defineTheme({ ...lightTheme, colors: { ...lightTheme.colors, primary: '#6750A4' } })
<ThemeProvider theme={theme}>
```

Key differences:
- NativeBase uses numbered color scales (`primary.500`). OnlyNative uses MD3 role-based tokens (`primary`, `onPrimary`, `primaryContainer`).
- NativeBase responsive props (`{{ base: 1, md: 2 }}`) become `useBreakpointValue({ compact: 1, medium: 2 })` from `@onlynative/core`.

### Component Mapping

| NativeBase | OnlyNative | Notes |
|---|---|---|
| `<NativeBaseProvider>` | `<ThemeProvider>` | |
| `<Button>` | `<Button>` | No utility props |
| `<IconButton>` | `<IconButton>` | |
| `<Input>` | `<TextField>` | |
| `<Checkbox>` | `<Checkbox>` | `isChecked` becomes `value` |
| `<Radio>` | `<Radio>` | |
| `<Switch>` | `<Switch>` | `isChecked` becomes `value` |
| `<Text>` | `<Typography>` | Use `variant` for sizing |
| `<Box>` | `<Box>` | Use `p`, `m` spacing shortcuts or `style` |
| `<HStack>` | `<Row>` | |
| `<VStack>` | `<Column>` | |
| `<Card>` | `<Card>` | |
| `<FlatList>` | Use RN `FlatList` directly | |
| `<Pressable>` | Use RN `Pressable` directly | |
| `<Modal>` | — | Not yet available |
| `<Toast>` | — | Not yet available |
| `<Select>` | — | Not yet available |
| `<Badge>` | — | Not yet available |
| `<Actionsheet>` | — | Not yet available |

### Key Differences

**Utility props → style prop:**

```tsx
// Before (NativeBase)
<Box bg="primary.500" p={4} rounded="lg" shadow={2}>
  <Text fontSize="lg" color="white" bold>Hello</Text>
</Box>

// After (OnlyNative)
<Box p="md" style={{ backgroundColor: theme.colors.primary, borderRadius: theme.shape.cornerLarge }}>
  <Typography variant="titleMedium" color={theme.colors.onPrimary}>Hello</Typography>
</Box>
```

OnlyNative's `Box` supports spacing shortcuts (`p`, `m`, `px`, `py`, `gap`) using theme spacing keys (`xs`, `sm`, `md`, `lg`, `xl`) or numbers.

**Checkbox / Switch:**

```tsx
// Before (NativeBase)
<Checkbox isChecked={checked} onChange={setChecked} />
<Switch isChecked={on} onToggle={setOn} />

// After (OnlyNative)
<Checkbox value={checked} onValueChange={setChecked} />
<Switch value={on} onValueChange={setOn} />
```

---

## From React Native Elements

### Theme Migration

```tsx
// Before (RN Elements)
import { ThemeProvider, createTheme } from '@rneui/themed'
const theme = createTheme({ lightColors: { primary: '#6750A4' } })
<ThemeProvider theme={theme}>

// After (OnlyNative)
import { ThemeProvider, defineTheme, lightTheme } from '@onlynative/core'
const theme = defineTheme({ ...lightTheme, colors: { ...lightTheme.colors, primary: '#6750A4' } })
<ThemeProvider theme={theme}>
```

RN Elements uses a flat color scheme (`primary`, `secondary`, `background`, `error`). OnlyNative uses the full MD3 token set (69 color roles).

### Component Mapping

| RN Elements | OnlyNative | Notes |
|---|---|---|
| `<ThemeProvider>` | `<ThemeProvider>` | Different theme shape |
| `<Button>` | `<Button>` | `type` becomes `variant` |
| `<Input>` | `<TextField>` | |
| `<CheckBox>` | `<Checkbox>` | |
| `<Switch>` | `<Switch>` | |
| `<Card>` | `<Card>` | |
| `<ListItem>` | `<ListItem>` | |
| `<Text>` | `<Typography>` | |
| `<Header>` | `<AppBar>` | |
| `<Chip>` | `<Chip>` | |
| `<Divider>` | `<ListDivider>` | |
| `<Icon>` | Use `@expo/vector-icons` directly | |
| `<Avatar>` | — | Not yet available |
| `<Overlay>` | — | Not yet available |
| `<SearchBar>` | — | Not yet available |
| `<BottomSheet>` | — | Not yet available |

### Key Prop Changes

**Button:**

| RN Elements | OnlyNative | Notes |
|---|---|---|
| `type="solid"` | `variant="filled"` | |
| `type="outline"` | `variant="outlined"` | |
| `type="clear"` | `variant="text"` | |
| `title="Save"` | Children: `<Button>Save</Button>` | Children-based API |
| `color` | `containerColor` | |
| `titleStyle` | `labelStyle` | |
| `buttonStyle` | `style` | |
| `icon` | `leadingIcon` | String name |

**Input → TextField:**

| RN Elements | OnlyNative | Notes |
|---|---|---|
| `placeholder` | `label` | Floating label instead of placeholder |
| `errorMessage` | `errorText` | |
| `leftIcon` | `leadingIcon` | String name |
| `rightIcon` | `trailingIcon` | String name |
| `inputStyle` | `inputStyle` | |
| `containerStyle` | `style` | |

---

## From Tamagui

Tamagui uses shorthand style props and a build-time compiler. OnlyNative uses standard React Native styles with no compiler required.

### Theme Migration

```tsx
// Before (Tamagui)
import { TamaguiProvider, createTamagui } from 'tamagui'
const config = createTamagui({ themes: { light: { background: '#fff', color: '#000' } } })
<TamaguiProvider config={config}>

// After (OnlyNative)
import { ThemeProvider } from '@onlynative/core'
// Use built-in MD3 themes or generate from a seed color
import { createMaterialTheme } from '@onlynative/core/create-theme'
const { lightTheme, darkTheme } = createMaterialTheme('#6750A4')
<ThemeProvider theme={lightTheme}>
```

Key differences:
- Tamagui tokens (`$color.primary`, `$size.md`) become theme values via `useTheme()` hook.
- No build-time compiler or Babel plugin needed.
- No `tamagui.config.ts` file required.

### Component Mapping

| Tamagui | OnlyNative | Notes |
|---|---|---|
| `<TamaguiProvider>` | `<ThemeProvider>` | |
| `<Button>` | `<Button>` | |
| `<Input>` | `<TextField>` | Has floating label |
| `<Checkbox>` | `<Checkbox>` | |
| `<RadioGroup>` / `<RadioGroup.Item>` | `<Radio>` | Single component |
| `<Switch>` | `<Switch>` | |
| `<Card>` | `<Card>` | |
| `<Text>` / `<Paragraph>` / `<H1>`–`<H6>` | `<Typography>` | Use `variant` prop |
| `<XStack>` | `<Row>` | |
| `<YStack>` | `<Column>` | |
| `<Stack>` | `<Box>` | |
| `<ListItem>` | `<ListItem>` | |
| `<Sheet>` | — | Not yet available |
| `<Dialog>` | — | Not yet available |
| `<Popover>` | — | Not yet available |
| `<Select>` | — | Not yet available |
| `<Tabs>` | — | Not yet available |

### Key Differences

**Shorthand props → style prop:**

```tsx
// Before (Tamagui)
<YStack bg="$background" p="$4" br="$4" gap="$2">
  <Text fontSize="$6" color="$color">Hello</Text>
</YStack>

// After (OnlyNative)
const theme = useTheme()
<Column gap="md" p="md" style={{ backgroundColor: theme.colors.surface, borderRadius: theme.shape.cornerMedium }}>
  <Typography variant="titleLarge">Hello</Typography>
</Column>
```

**Typography:**

```tsx
// Before (Tamagui)
<H1>Title</H1>
<Paragraph size="$5">Body text</Paragraph>

// After (OnlyNative)
<Typography variant="displaySmall">Title</Typography>
<Typography variant="bodyLarge">Body text</Typography>
```
