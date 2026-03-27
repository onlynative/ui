import { material } from '../presets/material'
import { darkTheme } from '../theme/dark'
import { lightTheme } from '../theme/light'
import { defaultTopAppBarTokens } from '../theme/topAppBar'

describe('material preset', () => {
  it('contains lightTheme', () => {
    expect(material.lightTheme).toBe(lightTheme)
  })

  it('contains darkTheme', () => {
    expect(material.darkTheme).toBe(darkTheme)
  })

  it('contains defaultTopAppBarTokens', () => {
    expect(material.defaultTopAppBarTokens).toBe(defaultTopAppBarTokens)
  })
})
