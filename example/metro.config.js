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

module.exports = config
