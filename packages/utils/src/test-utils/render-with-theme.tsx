import { render, type RenderOptions } from '@testing-library/react-native'
import type { ReactElement } from 'react'
import { ThemeProvider } from '@onlynative/core'

export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options,
  })
}
