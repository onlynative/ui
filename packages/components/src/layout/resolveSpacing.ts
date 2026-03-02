import type { Theme } from '@onlynative/core'
import type { SpacingValue } from './types'

export function resolveSpacing(
  spacing: Theme['spacing'],
  value: SpacingValue | undefined,
): number | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value
  return spacing[value]
}
