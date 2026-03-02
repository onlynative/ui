import { useMemo } from 'react'
import type { ViewStyle } from 'react-native'

import { Box } from './Box'
import type { RowProps } from './types'

export function Row({
  wrap = false,
  inverted = false,
  style,
  ...boxProps
}: RowProps) {
  const directionStyle = useMemo<ViewStyle>(
    () => ({
      flexDirection: inverted ? 'row-reverse' : 'row',
      ...(wrap && { flexWrap: 'wrap' }),
    }),
    [wrap, inverted],
  )

  return <Box {...boxProps} style={[directionStyle, style]} />
}
