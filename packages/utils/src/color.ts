interface RgbChannels {
  r: number
  g: number
  b: number
}

function parseHexColor(color: string): RgbChannels | null {
  const normalized = color.replace('#', '')

  if (normalized.length !== 6 && normalized.length !== 8) {
    return null
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return null
  }

  return { r, g, b }
}

function clampAlpha(alpha: number): number {
  return Math.max(0, Math.min(1, alpha))
}

export function alphaColor(color: string, alpha: number): string {
  const channels = parseHexColor(color)
  const boundedAlpha = clampAlpha(alpha)

  if (!channels) {
    return color
  }

  return `rgba(${channels.r}, ${channels.g}, ${channels.b}, ${boundedAlpha})`
}

export function blendColor(
  base: string,
  overlay: string,
  overlayAlpha: number,
): string {
  const baseChannels = parseHexColor(base)
  const overlayChannels = parseHexColor(overlay)
  const boundedAlpha = clampAlpha(overlayAlpha)

  if (!baseChannels || !overlayChannels) {
    return alphaColor(overlay, boundedAlpha)
  }

  const r = Math.round(
    (1 - boundedAlpha) * baseChannels.r + boundedAlpha * overlayChannels.r,
  )
  const g = Math.round(
    (1 - boundedAlpha) * baseChannels.g + boundedAlpha * overlayChannels.g,
  )
  const b = Math.round(
    (1 - boundedAlpha) * baseChannels.b + boundedAlpha * overlayChannels.b,
  )

  return `rgb(${r}, ${g}, ${b})`
}
