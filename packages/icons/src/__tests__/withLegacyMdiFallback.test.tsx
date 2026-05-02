import { render } from '@testing-library/react-native'
import * as React from 'react'
import { Text } from 'react-native'
import { resetWarnOnceForTests } from '../warn'
import { withLegacyMdiFallback } from '../withLegacyMdiFallback'

const renderName = (name: string) => <Text testID="icon">{name}</Text>

describe('withLegacyMdiFallback', () => {
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    resetWarnOnceForTests()
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('passes through names the base resolver knows', () => {
    const base = jest.fn((name: string) =>
      name === 'search' ? renderName(name) : null,
    )
    const resolver = withLegacyMdiFallback(base)
    const { getByTestId } = render(
      <>{resolver('search', { size: 18, color: '#000' })}</>,
    )
    expect(getByTestId('icon').props.children).toBe('search')
    expect(base).toHaveBeenCalledTimes(1)
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('rewrites MDI names using the lucide map by default', () => {
    const known = new Set(['search'])
    const base = jest.fn((name: string) =>
      known.has(name) ? renderName(name) : null,
    )
    const resolver = withLegacyMdiFallback(base)
    const { getByTestId } = render(
      <>{resolver('magnify', { size: 18, color: '#000' })}</>,
    )
    expect(getByTestId('icon').props.children).toBe('search')
    expect(warnSpy).toHaveBeenCalledTimes(1)
  })

  it('uses the phosphor map when target is "phosphor"', () => {
    const known = new Set(['MagnifyingGlass'])
    const base = jest.fn((name: string) =>
      known.has(name) ? renderName(name) : null,
    )
    const resolver = withLegacyMdiFallback(base, { target: 'phosphor' })
    const { getByTestId } = render(
      <>{resolver('magnify', { size: 18, color: '#000' })}</>,
    )
    expect(getByTestId('icon').props.children).toBe('MagnifyingGlass')
  })

  it('accepts a custom alias map', () => {
    const known = new Set(['edit'])
    const base = jest.fn((name: string) =>
      known.has(name) ? renderName(name) : null,
    )
    const resolver = withLegacyMdiFallback(base, {
      target: { pencil: 'edit' },
    })
    const { getByTestId } = render(
      <>{resolver('pencil', { size: 18, color: '#000' })}</>,
    )
    expect(getByTestId('icon').props.children).toBe('edit')
  })

  it('returns null when neither the base nor the alias map resolves', () => {
    const base = jest.fn(() => null)
    const resolver = withLegacyMdiFallback(base, { warn: false })
    expect(resolver('truly-unknown', { size: 18, color: '#000' })).toBeNull()
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('suppresses warnings when warn is false', () => {
    const known = new Set(['search'])
    const base = jest.fn((name: string) =>
      known.has(name) ? renderName(name) : null,
    )
    const resolver = withLegacyMdiFallback(base, { warn: false })
    resolver('magnify', { size: 18, color: '#000' })
    expect(warnSpy).not.toHaveBeenCalled()
  })
})
