import { screen, fireEvent } from '@testing-library/react-native'
import { StyleSheet } from 'react-native'

import { Button } from '../button/Button'
import { renderWithTheme } from '../test-utils/render-with-theme'

describe('Button', () => {
  it('renders the label text', () => {
    renderWithTheme(<Button>Press me</Button>)
    expect(screen.getByText('Press me')).toBeTruthy()
  })

  it('has the button accessibility role', () => {
    renderWithTheme(<Button>Action</Button>)
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    renderWithTheme(<Button onPress={onPress}>Tap</Button>)
    fireEvent.press(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn()
    renderWithTheme(
      <Button onPress={onPress} disabled>
        Tap
      </Button>,
    )
    fireEvent.press(screen.getByRole('button'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('renders a leading icon', () => {
    renderWithTheme(<Button leadingIcon="check">OK</Button>)
    expect(screen.getByText('check')).toBeTruthy()
  })

  it('renders a trailing icon', () => {
    renderWithTheme(<Button trailingIcon="arrow-right">Next</Button>)
    expect(screen.getByText('arrow-right')).toBeTruthy()
  })

  describe('overrides', () => {
    it('applies containerColor to the container background', () => {
      renderWithTheme(
        <Button containerColor="#FF0000">Custom</Button>,
      )
      const button = screen.getByRole('button')
      const flatStyle = StyleSheet.flatten(button.props.style)
      expect(flatStyle.backgroundColor).toBe('#FF0000')
    })

    it('applies contentColor to the label text', () => {
      renderWithTheme(
        <Button contentColor="#00FF00">Custom</Button>,
      )
      const label = screen.getByText('Custom')
      const flatStyle = StyleSheet.flatten(label.props.style)
      expect(flatStyle.color).toBe('#00FF00')
    })

    it('applies labelStyle to the label text', () => {
      renderWithTheme(
        <Button labelStyle={{ fontWeight: '900' }}>Styled</Button>,
      )
      const label = screen.getByText('Styled')
      const flatStyle = StyleSheet.flatten(label.props.style)
      expect(flatStyle.fontWeight).toBe('900')
    })

    it('contentColor does not get overridden by labelStyle without color', () => {
      renderWithTheme(
        <Button contentColor="#00FF00" labelStyle={{ fontSize: 20 }}>
          Both
        </Button>,
      )
      const label = screen.getByText('Both')
      const flatStyle = StyleSheet.flatten(label.props.style)
      expect(flatStyle.color).toBe('#00FF00')
      expect(flatStyle.fontSize).toBe(20)
    })
  })
})
