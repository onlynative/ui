// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _MCIcons: any = null
let _resolved = false

/**
 * Lazily resolves MaterialCommunityIcons from `@expo/vector-icons`.
 *
 * Called at render time (not module load) so that components can be
 * imported without `@expo/vector-icons` installed — the error only
 * fires when an icon is actually rendered.
 */
export function getMaterialCommunityIcons() {
  if (!_resolved) {
    _resolved = true
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require('@expo/vector-icons/MaterialCommunityIcons')
      _MCIcons = mod.default || mod
    } catch {
      _MCIcons = null
    }
  }
  if (!_MCIcons) {
    throw new Error(
      '@expo/vector-icons is required for icon support. ' +
        'Install it with: npx expo install @expo/vector-icons',
    )
  }
  return _MCIcons
}
