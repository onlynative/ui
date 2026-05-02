const seen = new Set<string>()

export function warnOnce(key: string, message: string): void {
  if (seen.has(key)) return
  seen.add(key)
  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(message)
  }
}

export function resetWarnOnceForTests(): void {
  seen.clear()
}
