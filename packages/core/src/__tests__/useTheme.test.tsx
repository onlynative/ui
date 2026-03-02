import { renderHook } from '@testing-library/react-native'
import type { ReactNode } from 'react'

import { MaterialProvider } from '../provider/MaterialProvider'
import { useTheme } from '../provider/useTheme'
import { darkTheme } from '../theme/dark'
import { lightTheme } from '../theme/light'

function wrapper({ children }: { children: ReactNode }) {
  return <MaterialProvider>{children}</MaterialProvider>
}

describe('useTheme', () => {
  it('returns the light theme by default', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current).toBe(lightTheme)
  })

  it('returns a custom theme when provided', () => {
    function darkWrapper({ children }: { children: ReactNode }) {
      return <MaterialProvider theme={darkTheme}>{children}</MaterialProvider>
    }

    const { result } = renderHook(() => useTheme(), {
      wrapper: darkWrapper,
    })
    expect(result.current).toBe(darkTheme)
  })

  it('provides the expected color structure', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.colors).toHaveProperty('primary')
    expect(result.current.colors).toHaveProperty('onPrimary')
    expect(result.current.colors).toHaveProperty('surface')
    expect(result.current.colors).toHaveProperty('onSurface')
  })

  it('provides typography tokens', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.typography).toHaveProperty('bodyMedium')
    expect(result.current.typography).toHaveProperty('headlineLarge')
  })
})
