import { render } from '@testing-library/react-native'
import * as React from 'react'
import { Text } from 'react-native'
import { createVectorIconsResolver } from '../createVectorIconsResolver'

const FakeIonicons = ({
  name,
  size,
  color,
}: {
  name: string
  size?: number
  color?: string
}) => <Text testID="ionicon">{`${name}:${size ?? '?'}:${color ?? '?'}`}</Text>

describe('createVectorIconsResolver', () => {
  it('forwards the name to the icon set', () => {
    const resolver = createVectorIconsResolver({ IconSet: FakeIonicons })
    const { getByTestId } = render(
      <>{resolver('checkmark', { size: 18, color: '#000' })}</>,
    )
    expect(getByTestId('ionicon').props.children).toBe('checkmark:18:#000')
  })

  it('rewrites the name through the aliases map first', () => {
    const resolver = createVectorIconsResolver({
      IconSet: FakeIonicons,
      aliases: { check: 'checkmark', close: 'close-outline' },
    })
    const { getByTestId } = render(
      <>{resolver('check', { size: 24, color: '#fff' })}</>,
    )
    expect(getByTestId('ionicon').props.children).toBe('checkmark:24:#fff')
  })
})
