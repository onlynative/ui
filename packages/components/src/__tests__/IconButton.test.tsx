import { screen, fireEvent } from '@testing-library/react-native'
import { StyleSheet } from 'react-native'

import { IconButton } from '../icon-button/IconButton'
import { renderWithTheme } from '../test-utils/render-with-theme'

describe('IconButton', () => {
  it('renders with the button accessibility role', () => {
    renderWithTheme(
      <IconButton icon="heart" accessibilityLabel="Like" />,
    )
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    renderWithTheme(
      <IconButton
        icon="heart"
        accessibilityLabel="Like"
        onPress={onPress}
      />,
    )
    fireEvent.press(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn()
    renderWithTheme(
      <IconButton
        icon="heart"
        accessibilityLabel="Like"
        onPress={onPress}
        disabled
      />,
    )
    fireEvent.press(screen.getByRole('button'))
    expect(onPress).not.toHaveBeenCalled()
  })

  describe('overrides', () => {
    it('applies containerColor to the container background', () => {
      renderWithTheme(
        <IconButton
          icon="heart"
          accessibilityLabel="Like"
          containerColor="#FF0000"
        />,
      )
      const button = screen.getByRole('button')
      const flatStyle = StyleSheet.flatten(button.props.style)
      expect(flatStyle.backgroundColor).toBe('#FF0000')
    })

    it('applies contentColor to the icon', () => {
      renderWithTheme(
        <IconButton
          icon="heart"
          accessibilityLabel="Like"
          contentColor="#00FF00"
        />,
      )
      const icon = screen.getByText('heart')
      expect(icon.props.color).toBe('#00FF00')
    })

    it('contentColor takes precedence over iconColor', () => {
      renderWithTheme(
        <IconButton
          icon="heart"
          accessibilityLabel="Like"
          iconColor="#FF0000"
          contentColor="#00FF00"
        />,
      )
      const icon = screen.getByText('heart')
      expect(icon.props.color).toBe('#00FF00')
    })

    it('applies the style prop to the container', () => {
      renderWithTheme(
        <IconButton
          icon="heart"
          accessibilityLabel="Like"
          style={{ margin: 10 }}
        />,
      )
      const button = screen.getByRole('button')
      const flatStyle = StyleSheet.flatten(button.props.style)
      expect(flatStyle.margin).toBe(10)
    })
  })
})
