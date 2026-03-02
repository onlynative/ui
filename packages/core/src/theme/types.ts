export interface Theme {
  colors: Colors
  typography: Typography
  shape: Shape
  spacing: Spacing
  topAppBar?: TopAppBarTokens
  stateLayer: StateLayer
  elevation: Elevation
  motion: Motion
}

export interface Colors {
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  primaryFixed: string
  onPrimaryFixed: string
  primaryFixedDim: string
  onPrimaryFixedVariant: string
  secondary: string
  onSecondary: string
  secondaryContainer: string
  onSecondaryContainer: string
  secondaryFixed: string
  onSecondaryFixed: string
  secondaryFixedDim: string
  onSecondaryFixedVariant: string
  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string
  tertiaryFixed: string
  onTertiaryFixed: string
  tertiaryFixedDim: string
  onTertiaryFixedVariant: string
  error: string
  onError: string
  errorContainer: string
  onErrorContainer: string
  background: string
  onBackground: string
  surface: string
  surfaceDim: string
  surfaceBright: string
  surfaceContainerLowest: string
  surfaceContainerLow: string
  surfaceContainer: string
  surfaceContainerHigh: string
  surfaceContainerHighest: string
  onSurface: string
  surfaceVariant: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  surfaceTint: string
  shadow: string
  scrim: string
  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string
}

export interface Typography {
  displayLarge: TextStyle
  displayMedium: TextStyle
  displaySmall: TextStyle
  headlineLarge: TextStyle
  headlineMedium: TextStyle
  headlineSmall: TextStyle
  titleLarge: TextStyle
  titleMedium: TextStyle
  titleSmall: TextStyle
  bodyLarge: TextStyle
  bodyMedium: TextStyle
  bodySmall: TextStyle
  labelLarge: TextStyle
  labelMedium: TextStyle
  labelSmall: TextStyle
}

export type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'

export interface TextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: FontWeight
  lineHeight: number
  letterSpacing: number
}

export interface Shape {
  cornerNone: number
  cornerExtraSmall: number
  cornerSmall: number
  cornerMedium: number
  cornerLarge: number
  cornerExtraLarge: number
  cornerFull: number
}

export interface Spacing {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
}

export interface TopAppBarTokens {
  horizontalPadding: number
  titleStartInset: number
  smallContainerHeight: number
  mediumContainerHeight: number
  largeContainerHeight: number
  topRowHeight: number
  sideSlotMinHeight: number
  iconFrameSize: number
  mediumTitleBottomPadding: number
  largeTitleBottomPadding: number
}

export interface StateLayer {
  pressedOpacity: number
  focusedOpacity: number
  hoveredOpacity: number
  disabledOpacity: number
}

export interface Elevation {
  level0: ElevationLevel
  level1: ElevationLevel
  level2: ElevationLevel
  level3: ElevationLevel
}

export interface ElevationLevel {
  shadowColor: string
  shadowOffset: ShadowOffset
  shadowOpacity: number
  shadowRadius: number
  elevation: number
}

export interface ShadowOffset {
  width: number
  height: number
}

export interface Motion {
  durationShort1: number
  durationShort2: number
  durationShort3: number
  durationShort4: number
  durationMedium1: number
  durationMedium2: number
  durationMedium3: number
  durationMedium4: number
  durationLong1: number
  durationLong2: number
  durationLong3: number
  durationLong4: number
  easingLinear: string
  easingStandard: string
  easingStandardAccelerate: string
  easingStandardDecelerate: string
  easingEmphasized: string
  easingEmphasizedAccelerate: string
  easingEmphasizedDecelerate: string
}
