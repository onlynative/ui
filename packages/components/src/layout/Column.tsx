import { useMemo } from 'react'
import type { ViewStyle } from 'react-native'

import { Box } from './Box'
import type { ColumnProps } from './types'

export function Column({ inverted = false, style, ...boxProps }: ColumnProps) {
  const directionStyle = useMemo<ViewStyle>(
    () => ({
      flexDirection: inverted ? 'column-reverse' : 'column',
    }),
    [inverted],
  )

  return <Box {...boxProps} style={[directionStyle, style]} />
}
