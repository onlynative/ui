const path = require('path')
const fs = require('fs')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
const workspaceRoot = path.resolve(__dirname, '..')
const stableEmptyModulePath = path.join(
  workspaceRoot,
  'node_modules',
  'metro-runtime',
  'src',
  'modules',
  'empty-module.js',
)

if (fs.existsSync(stableEmptyModulePath)) {
  config.resolver.emptyModulePath = stableEmptyModulePath
}

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// Resolve workspace @onlynative/* packages to source so they go through the
// example's Babel chain. Two reasons:
//  1. `react-native-worklets/plugin` (auto-applied by babel-preset-expo) needs
//     to process files that use Reanimated worklet hooks.
//  2. The published dists (built by tsup) use the esbuild `__require` shim for
//     dynamic CJS lookups, which Metro can't statically follow — so packages
//     like `@expo/vector-icons` resolved via `__require` aren't bundled.
const WORKSPACE_PACKAGES = {
  '@onlynative/components': path.resolve(
    workspaceRoot,
    'packages/components/src',
  ),
  '@onlynative/utils': path.resolve(workspaceRoot, 'packages/utils/src'),
}
const previousResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const [pkg, srcDir] of Object.entries(WORKSPACE_PACKAGES)) {
    if (moduleName !== pkg && !moduleName.startsWith(`${pkg}/`)) continue
    const subpath =
      moduleName === pkg ? 'index' : `${moduleName.slice(pkg.length + 1)}/index`
    for (const ext of ['ts', 'tsx']) {
      const candidate = path.join(srcDir, `${subpath}.${ext}`)
      if (fs.existsSync(candidate)) {
        return { filePath: candidate, type: 'sourceFile' }
      }
    }
  }
  if (previousResolveRequest) {
    return previousResolveRequest(context, moduleName, platform)
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
