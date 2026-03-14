import type {
  ComponentRegistryEntry,
  OnlyNativeConfig,
  RegistryIndex,
  UtilsRegistry,
} from './types'

function buildBaseUrl(config: OnlyNativeConfig): string {
  return `${config.registryUrl}/${config.registryVersion}`
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    )
  }

  return response.json() as Promise<T>
}

export async function fetchRegistryIndex(
  config: OnlyNativeConfig,
): Promise<RegistryIndex> {
  const url = `${buildBaseUrl(config)}/registry/index.json`
  return fetchJSON<RegistryIndex>(url)
}

export async function fetchComponentEntry(
  config: OnlyNativeConfig,
  name: string,
): Promise<ComponentRegistryEntry> {
  const url = `${buildBaseUrl(config)}/registry/components/${name}.json`
  return fetchJSON<ComponentRegistryEntry>(url)
}

export async function fetchUtilsRegistry(
  config: OnlyNativeConfig,
): Promise<UtilsRegistry> {
  const url = `${buildBaseUrl(config)}/registry/utils.json`
  return fetchJSON<UtilsRegistry>(url)
}

export async function fetchFileContent(
  config: OnlyNativeConfig,
  filePath: string,
): Promise<string> {
  const url = `${buildBaseUrl(config)}/${filePath}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch file ${filePath}: ${response.status} ${response.statusText}`,
    )
  }

  return response.text()
}
