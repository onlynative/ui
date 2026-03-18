import { fireEvent, screen } from '@testing-library/react-native'
import { StyleSheet } from 'react-native'

import { Avatar } from '../avatar/Avatar'
import { renderWithTheme } from '@onlynative/utils/test'

describe('Avatar', () => {
  describe('content', () => {
    it('renders a default icon when no props are provided', () => {
      renderWithTheme(<Avatar accessibilityLabel="User" />)
      expect(screen.getByLabelText('User')).toBeTruthy()
    })

    it('renders initials from label (max 2 chars, uppercase)', () => {
      renderWithTheme(<Avatar label="john" />)
      expect(screen.getByText('JO')).toBeTruthy()
    })

    it('renders only 2 characters from a longer label', () => {
      renderWithTheme(<Avatar label="Alexander" />)
      expect(screen.getByText('AL')).toBeTruthy()
    })

    it('renders icon when icon prop is provided alongside label', () => {
      // icon takes priority over label
      renderWithTheme(<Avatar icon="account" label="JD" testID="avatar" />)
      // label text should not be rendered
      expect(screen.queryByText('JD')).toBeNull()
    })
  })

  describe('interactivity', () => {
    it('renders as non-interactive when no onPress is provided', () => {
      renderWithTheme(<Avatar label="AB" />)
      expect(screen.queryByRole('button')).toBeNull()
    })

    it('renders as a button when onPress is provided', () => {
      renderWithTheme(
        <Avatar
          label="AB"
          onPress={() => {}}
          accessibilityLabel="Open profile"
        />,
      )
      expect(screen.getByRole('button')).toBeTruthy()
    })

    it('calls onPress when pressed', () => {
      const onPress = jest.fn()
      renderWithTheme(
        <Avatar
          label="AB"
          onPress={onPress}
          accessibilityLabel="Open profile"
        />,
      )
      fireEvent.press(screen.getByRole('button'))
      expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('sets accessibilityLabel on the interactive container', () => {
      renderWithTheme(
        <Avatar
          label="AB"
          onPress={() => {}}
          accessibilityLabel="Open profile"
        />,
      )
      expect(screen.getByLabelText('Open profile')).toBeTruthy()
    })
  })

  describe('sizes', () => {
    it.each([
      ['xSmall', 24],
      ['small', 32],
      ['medium', 40],
      ['large', 56],
      ['xLarge', 112],
    ] as const)('size "%s" renders with %dpx dimensions', (size, px) => {
      renderWithTheme(<Avatar testID="avatar" size={size} />)
      const avatar = screen.getByTestId('avatar')
      const flatStyle = StyleSheet.flatten(avatar.props.style)
      expect(flatStyle.width).toBe(px)
      expect(flatStyle.height).toBe(px)
    })

    it('defaults to medium (40px)', () => {
      renderWithTheme(<Avatar testID="avatar" />)
      const avatar = screen.getByTestId('avatar')
      const flatStyle = StyleSheet.flatten(avatar.props.style)
      expect(flatStyle.width).toBe(40)
      expect(flatStyle.height).toBe(40)
    })
  })

  describe('overrides', () => {
    it('applies containerColor as background', () => {
      renderWithTheme(
        <Avatar testID="avatar" label="AB" containerColor="#FF0000" />,
      )
      const avatar = screen.getByTestId('avatar')
      const flatStyle = StyleSheet.flatten(avatar.props.style)
      expect(flatStyle.backgroundColor).toBe('#FF0000')
    })

    it('applies containerColor on interactive avatar', () => {
      renderWithTheme(
        <Avatar
          label="AB"
          containerColor="#FF0000"
          onPress={() => {}}
          accessibilityLabel="Avatar"
        />,
      )
      const avatar = screen.getByRole('button')
      const flatStyle = StyleSheet.flatten(avatar.props.style)
      expect(flatStyle.backgroundColor).toBe('#FF0000')
    })

    it('is always circular (cornerFull border radius)', () => {
      renderWithTheme(<Avatar testID="avatar" />)
      const avatar = screen.getByTestId('avatar')
      const flatStyle = StyleSheet.flatten(avatar.props.style)
      expect(flatStyle.borderRadius).toBe(9999)
    })
  })
})
