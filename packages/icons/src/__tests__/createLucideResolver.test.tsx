import { render } from '@testing-library/react-native'
import * as React from 'react'
import { Text } from 'react-native'
import { createLucideResolver } from '../createLucideResolver'
import { resetWarnOnceForTests } from '../warn'

const Check = ({
  size,
  color,
  strokeWidth,
}: {
  size?: number
  color?: string
  strokeWidth?: number
}) => (
  <Text testID="check">
    {`check:${size ?? '?'}:${color ?? '?'}:${strokeWidth ?? '?'}`}
  </Text>
)

const Search = ({ size, color }: { size?: number; color?: string }) => (
  <Text testID="search">{`search:${size ?? '?'}:${color ?? '?'}`}</Text>
)

describe('createLucideResolver', () => {
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    resetWarnOnceForTests()
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('renders a registered icon with the provided size and color', () => {
    const resolver = createLucideResolver({ icons: { check: Check } })
    const { getByTestId } = render(
      <>{resolver('check', { size: 18, color: '#fff' })}</>,
    )
    expect(getByTestId('check').props.children).toBe('check:18:#fff:?')
  })

  it('applies the configured strokeWidth', () => {
    const resolver = createLucideResolver({
      icons: { check: Check },
      strokeWidth: 1.5,
    })
    const { getByTestId } = render(
      <>{resolver('check', { size: 18, color: '#000' })}</>,
    )
    expect(getByTestId('check').props.children).toBe('check:18:#000:1.5')
  })

  it('rewrites legacy MDI names when mdiCompat is true', () => {
    const resolver = createLucideResolver({
      icons: { search: Search },
      mdiCompat: true,
    })
    const { getByTestId } = render(
      <>{resolver('magnify', { size: 20, color: '#222' })}</>,
    )
    expect(getByTestId('search').props.children).toBe('search:20:#222')
  })

  it('lets a custom alias override the built-in MDI map', () => {
    const Custom = ({ size }: { size?: number }) => (
      <Text testID="custom">{`custom:${size ?? '?'}`}</Text>
    )
    const resolver = createLucideResolver({
      icons: { custom: Custom, search: Search },
      mdiCompat: { magnify: 'custom' },
    })
    const { getByTestId } = render(
      <>{resolver('magnify', { size: 20, color: '#000' })}</>,
    )
    expect(getByTestId('custom').props.children).toBe('custom:20')
  })

  it('lets you suppress a built-in alias by setting it to null', () => {
    const resolver = createLucideResolver({
      icons: { search: Search },
      mdiCompat: { magnify: null },
    })
    const result = resolver('magnify', { size: 20, color: '#000' })
    expect(result).toBeNull()
    expect(warnSpy).toHaveBeenCalledTimes(1)
  })

  it('warns once per missing name by default', () => {
    const resolver = createLucideResolver({ icons: {} })
    resolver('mystery', { size: 18, color: '#000' })
    resolver('mystery', { size: 18, color: '#000' })
    expect(warnSpy).toHaveBeenCalledTimes(1)
  })

  it('stays silent when onMissing is "silent"', () => {
    const resolver = createLucideResolver({
      icons: {},
      onMissing: 'silent',
    })
    expect(resolver('mystery', { size: 18, color: '#000' })).toBeNull()
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('delegates to onMissing resolver when provided', () => {
    const fallback = jest.fn().mockReturnValue(<Text testID="fallback" />)
    const resolver = createLucideResolver({
      icons: {},
      onMissing: fallback,
    })
    const { getByTestId } = render(
      <>{resolver('mystery', { size: 18, color: '#000' })}</>,
    )
    expect(getByTestId('fallback')).toBeTruthy()
    expect(fallback).toHaveBeenCalledWith('mystery', {
      size: 18,
      color: '#000',
    })
  })
})
