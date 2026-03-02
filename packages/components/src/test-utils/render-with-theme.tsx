import { render, type RenderOptions } from '@testing-library/react-native'
import type { ReactElement } from 'react'
import { MaterialProvider } from '@onlynative/core'

export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: ({ children }) => <MaterialProvider>{children}</MaterialProvider>,
    ...options,
  })
}
