import type { Shape } from './types'

/** MD3 default corner radius values (roundness = 1). */
const BASE_SHAPE: Omit<Shape, 'roundness'> = {
  cornerNone: 0,
  cornerExtraSmall: 4,
  cornerSmall: 8,
  cornerMedium: 12,
  cornerLarge: 16,
  cornerExtraLarge: 28,
  cornerFull: 999,
}

/**
 * Scales the intermediate corner radius tokens by a `roundness` multiplier.
 * `cornerNone` always stays `0` and `cornerFull` always stays `999`.
 *
 * @param roundness - Multiplier: `0` = sharp corners, `1` = default MD3, `2` = double rounding.
 * @returns A complete `Shape` object with scaled corner values.
 *
 * @example
 * applyRoundness(0)   // all corners 0 except cornerFull (999)
 * applyRoundness(1)   // default MD3 values
 * applyRoundness(1.5) // 50% rounder than MD3
 */
export function applyRoundness(roundness: number): Shape {
  return {
    roundness,
    cornerNone: BASE_SHAPE.cornerNone,
    cornerExtraSmall: Math.round(BASE_SHAPE.cornerExtraSmall * roundness),
    cornerSmall: Math.round(BASE_SHAPE.cornerSmall * roundness),
    cornerMedium: Math.round(BASE_SHAPE.cornerMedium * roundness),
    cornerLarge: Math.round(BASE_SHAPE.cornerLarge * roundness),
    cornerExtraLarge: Math.round(BASE_SHAPE.cornerExtraLarge * roundness),
    cornerFull: BASE_SHAPE.cornerFull,
  }
}
