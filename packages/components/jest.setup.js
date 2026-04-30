// Override RN's Text mock — the default mockComponent crashes on arrow function
// components exported by RN 0.81's Flow `component` syntax.
jest.mock('react-native/Libraries/Text/Text', () => {
  const React = require('react')
  const Text = React.forwardRef(({ children, ...props }, ref) =>
    React.createElement('RCTText', { ...props, ref }, children),
  )
  Text.displayName = 'Text'
  return { __esModule: true, default: Text }
})

jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: ({ name, style, ...props }) =>
      React.createElement('RCTText', { ...props, style }, name),
  }
})

jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { Text, View } = require('react-native')
  const AnimatedView = React.forwardRef((props, ref) =>
    React.createElement(View, { ...props, ref }),
  )
  AnimatedView.displayName = 'Animated.View'
  const AnimatedText = React.forwardRef((props, ref) =>
    React.createElement(Text, { ...props, ref }),
  )
  AnimatedText.displayName = 'Animated.Text'
  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      Text: AnimatedText,
      createAnimatedComponent: (c) => c,
    },
    View: AnimatedView,
    Text: AnimatedText,
    useSharedValue: (initial) => ({ value: initial }),
    useDerivedValue: (fn) => ({ value: fn() }),
    useAnimatedStyle: (fn) => fn(),
    useAnimatedProps: (fn) => fn(),
    cancelAnimation: () => {},
    withSpring: (v) => v,
    withTiming: (v) => v,
    withRepeat: (v) => v,
    Easing: { bezier: () => () => 0 },
    // Pick the input-matched output for static rendering. value=0 → first, value=1 → last.
    // This lets tests assert against the at-rest visual without animation running.
    interpolate: (value, _input, output) =>
      value >= 1 ? output[output.length - 1] : output[0],
    interpolateColor: (value, _input, output) =>
      value >= 1 ? output[output.length - 1] : output[0],
  }
})

jest.mock('react-native-safe-area-context', () => {
  const React = require('react')
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children, ...props }) =>
      React.createElement('View', props, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 320, height: 640 }),
  }
})
