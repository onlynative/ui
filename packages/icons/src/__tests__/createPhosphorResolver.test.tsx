import { render } from '@testing-library/react-native'
import * as React from 'react'
import { Text } from 'react-native'
import { createPhosphorResolver } from '../createPhosphorResolver'
import { resetWarnOnceForTests } from '../warn'

const Check = ({
  size,
  color,
  weight,
}: {
  size?: number
  color?: string
  weight?: string
}) => (
  <Text testID="check">
    {`check:${size ?? '?'}:${color ?? '?'}:${weight ?? '?'}`}
  </Text>
)

const MagnifyingGlass = ({
  size,
  color,
  weight,
}: {
  size?: number
  color?: string
  weight?: string
}) => (
  <Text testID="magnify">
    {`magnify:${size ?? '?'}:${color ?? '?'}:${weight ?? '?'}`}
  </Text>
)

describe('createPhosphorResolver', () => {
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    resetWarnOnceForTests()
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('renders a registered icon with weight', () => {
    const resolver = createPhosphorResolver({
      icons: { Check },
      weight: 'bold',
    })
    const { getByTestId } = render(
      <>{resolver('Check', { size: 24, color: '#000' })}</>,
    )
    expect(getByTestId('check').props.children).toBe('check:24:#000:bold')
  })

  it('rewrites legacy MDI names to PascalCase Phosphor names', () => {
    const resolver = createPhosphorResolver({
      icons: { MagnifyingGlass },
      mdiCompat: true,
    })
    const { getByTestId } = render(
      <>{resolver('magnify', { size: 20, color: '#222' })}</>,
    )
    expect(getByTestId('magnify').props.children).toBe('magnify:20:#222:?')
  })

  it('warns once per missing name', () => {
    const resolver = createPhosphorResolver({ icons: {} })
    resolver('mystery', { size: 18, color: '#000' })
    resolver('mystery', { size: 18, color: '#000' })
    expect(warnSpy).toHaveBeenCalledTimes(1)
  })

  it('skips rewriting when mdiCompat is omitted', () => {
    const resolver = createPhosphorResolver({
      icons: { MagnifyingGlass },
    })
    expect(resolver('magnify', { size: 20, color: '#000' })).toBeNull()
    expect(warnSpy).toHaveBeenCalledTimes(1)
  })
})
