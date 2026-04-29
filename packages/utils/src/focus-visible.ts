import { useEffect, useState } from 'react'

type Modality = 'keyboard' | 'pointer'

let currentModality: Modality = 'pointer'
const subscribers = new Set<(m: Modality) => void>()

function setModality(next: Modality) {
  if (currentModality !== next) {
    currentModality = next
    subscribers.forEach((fn) => fn(next))
  }
}

// Set up global modality listeners on web only. On native, modality stays
// 'pointer' so focus state never fires (touch users don't expect a focus ring).
// Hardware-keyboard users on native still get the rest of accessibility (the
// `accessibilityState` is set correctly); only the visual focus indicator is
// suppressed.
if (
  typeof document !== 'undefined' &&
  typeof window !== 'undefined' &&
  typeof document.addEventListener === 'function'
) {
  const onKeyDown = (e: KeyboardEvent) => {
    // Modifier-only keys shouldn't switch modality; they're often used with
    // mouse interactions.
    if (e.metaKey || e.ctrlKey || e.altKey) return
    setModality('keyboard')
  }
  const onPointerDown = () => setModality('pointer')

  document.addEventListener('keydown', onKeyDown, true)
  document.addEventListener('pointerdown', onPointerDown, true)
  document.addEventListener('mousedown', onPointerDown, true)
  document.addEventListener('touchstart', onPointerDown, true)
}

/**
 * Returns true when the user's most recent input was a keyboard event,
 * indicating that focus indicators should be visible. Mirrors the CSS
 * `:focus-visible` semantics for React Native.
 */
export function useFocusVisible(): boolean {
  const [keyboardActive, setKeyboardActive] = useState(
    currentModality === 'keyboard',
  )

  useEffect(() => {
    const fn = (m: Modality) => setKeyboardActive(m === 'keyboard')
    subscribers.add(fn)
    return () => {
      subscribers.delete(fn)
    }
  }, [])

  return keyboardActive
}

export function isFocusVisible(): boolean {
  return currentModality === 'keyboard'
}
