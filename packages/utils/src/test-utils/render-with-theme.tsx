import { ThemeProvider, darkTheme } from '@onlynative/core'
import type { Theme } from '@onlynative/core'
import { render, type RenderOptions } from '@testing-library/react-native'
import type { ReactElement } from 'react'

interface RenderWithThemeOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Pass a custom theme or `'dark'` for the built-in dark theme. Defaults to light. */
  theme?: Theme | 'dark'
}

export function renderWithTheme(
  ui: ReactElement,
  options?: RenderWithThemeOptions,
) {
  const { theme, ...renderOptions } = options ?? {}
  const themeValue = theme === 'dark' ? darkTheme : theme

  const wrapper = themeValue
    ? ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider theme={themeValue}>{children}</ThemeProvider>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

  return render(ui, {
    wrapper,
    ...renderOptions,
  })
}
