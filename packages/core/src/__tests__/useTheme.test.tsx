import { renderHook } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import { ThemeProvider } from '../provider/ThemeProvider'
import { useTheme } from '../provider/useTheme'
import { darkTheme } from '../theme/dark'
import { defineTheme } from '../theme/defineTheme'
import { lightTheme } from '../theme/light'
import type { BaseTheme } from '../theme/types'

function wrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

describe('useTheme', () => {
  it('returns the light theme by default', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current).toBe(lightTheme)
  })

  it('returns a custom theme when provided', () => {
    function darkWrapper({ children }: { children: ReactNode }) {
      return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
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

describe('ThemeProvider with custom theme', () => {
  interface CustomColors {
    [key: string]: string
    brand: string
    background: string
    text: string
  }

  interface CustomTypography {
    [key: string]: BaseTheme['typography'][string]
    heading: BaseTheme['typography'][string]
    body: BaseTheme['typography'][string]
  }

  interface CustomTheme extends BaseTheme {
    colors: CustomColors
    typography: CustomTypography
  }

  const customTheme = defineTheme<CustomTheme>({
    colors: {
      brand: '#FF6B00',
      background: '#FFFFFF',
      text: '#1A1A1A',
    },
    typography: {
      heading: {
        fontFamily: 'Inter',
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 32,
        letterSpacing: 0,
      },
      body: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        letterSpacing: 0.5,
      },
    },
    shape: lightTheme.shape,
    spacing: lightTheme.spacing,
    stateLayer: lightTheme.stateLayer,
    elevation: lightTheme.elevation,
    motion: lightTheme.motion,
  })

  it('provides a custom theme via ThemeProvider', () => {
    function customWrapper({ children }: { children: ReactNode }) {
      return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>
    }

    const { result } = renderHook(() => useTheme<CustomTheme>(), {
      wrapper: customWrapper,
    })
    expect(result.current.colors.brand).toBe('#FF6B00')
    expect(result.current.typography.heading.fontSize).toBe(24)
  })

  it('defineTheme returns the same object', () => {
    expect(customTheme.colors.brand).toBe('#FF6B00')
    expect(customTheme.spacing).toBe(lightTheme.spacing)
  })
})
