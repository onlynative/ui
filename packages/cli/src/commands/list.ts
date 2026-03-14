import path from 'node:path'
import chalk from 'chalk'
import fs from 'fs-extra'
import { readConfig, resolveAliasPath } from '../lib/config'
import { createSpinner, logger } from '../lib/logger'
import { fetchRegistryIndex, fetchComponentEntry } from '../lib/registry'

export async function listCommand(cwd: string): Promise<void> {
  logger.break()

  const config = await readConfig(cwd)
  const componentsDir = resolveAliasPath(
    config.aliases.components,
    cwd,
  )

  const spinner = createSpinner(
    'Fetching component registry...',
  )
  spinner.start()

  const registryIndex = await fetchRegistryIndex(config)
  spinner.succeed('Registry loaded')

  logger.break()
  console.log(
    chalk.bold(`Available components (v${registryIndex.version}):`),
  )
  logger.break()

  // Header
  console.log(
    `  ${chalk.dim(padEnd('Name', 28))}${chalk.dim(padEnd('Status', 14))}${chalk.dim('Description')}`,
  )
  console.log(
    `  ${chalk.dim('-'.repeat(70))}`,
  )

  for (const name of registryIndex.components) {
    const componentDir = path.join(componentsDir, name)
    const installed = await fs.pathExists(componentDir)

    let description = ''
    try {
      const entry = await fetchComponentEntry(config, name)
      description = entry.description
    } catch {
      // Fallback if we can't fetch the entry
    }

    const status = installed
      ? chalk.green('installed')
      : chalk.dim('-')
    const nameDisplay = installed
      ? chalk.green(name)
      : name

    console.log(
      `  ${padEnd(nameDisplay, installed ? 28 + 10 : 28)}${padEnd(status, installed ? 14 + 10 : 14)}${chalk.dim(description)}`,
    )
  }

  logger.break()
}

function padEnd(str: string, length: number): string {
  // Account for ANSI escape codes in string length
  const visibleLength = str.replace(
    // eslint-disable-next-line no-control-regex
    /\u001b\[\d+m/g,
    '',
  ).length
  const padding = Math.max(0, length - visibleLength)
  return str + ' '.repeat(padding)
}
