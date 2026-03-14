export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

export type ProjectType = 'expo' | 'react-native' | 'unknown'

export interface ProjectInfo {
  type: ProjectType
  packageManager: PackageManager
  hasTypeScript: boolean
  srcDir: string | null
  aliases: Record<string, string> | null
}

export interface OnlyNativeConfig {
  $schema?: string
  aliases: {
    components: string
    lib: string
  }
  registryUrl: string
  registryVersion: string
}

export interface RegistryIndex {
  version: string
  components: string[]
}

export interface ComponentRegistryEntry {
  name: string
  description: string
  files: string[]
  utils: string[]
  componentDependencies: string[]
  dependencies: Record<string, string>
  optionalDependencies: Record<string, string>
}

export interface UtilEntry {
  file: string
  exports: string[]
  dependencies: Record<string, string>
}

export type UtilsRegistry = Record<string, UtilEntry>

export interface ResolvedComponent {
  entry: ComponentRegistryEntry
  isDirectRequest: boolean
}

export interface ResolutionResult {
  components: ResolvedComponent[]
  utils: string[]
  npmDependencies: Record<string, string>
  optionalNpmDependencies: Record<string, string>
}
