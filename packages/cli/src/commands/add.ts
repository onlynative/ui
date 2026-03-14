import chalk from 'chalk'
import prompts from 'prompts'
import { readConfig } from '../lib/config'
import { detectProject } from '../lib/detector'
import { installComponents } from '../lib/installer'
import { createSpinner, logger } from '../lib/logger'
import { fetchRegistryIndex } from '../lib/registry'
import {
  getDependencyComponents,
  getComponentNames,
  resolveComponents,
} from '../lib/resolver'

interface AddOptions {
  force: boolean
  dryRun: boolean
}

export async function addCommand(
  componentNames: string[],
  cwd: string,
  options: AddOptions,
): Promise<void> {
  logger.break()

  // Load config
  const config = await readConfig(cwd)

  // Validate component names against registry
  const spinner = createSpinner(
    'Fetching component registry...',
  )
  spinner.start()

  const registryIndex = await fetchRegistryIndex(config)
  spinner.succeed('Registry loaded')

  const availableNames = registryIndex.components.map(
    (c) => c.name,
  )
  const invalid = componentNames.filter(
    (name) => !availableNames.includes(name),
  )

  if (invalid.length > 0) {
    logger.error(
      `Unknown component(s): ${invalid.map((n) => chalk.bold(n)).join(', ')}`,
    )
    logger.info(
      `Available: ${availableNames.join(', ')}`,
    )
    process.exit(1)
  }

  // Resolve dependency graph
  const resolveSpinner = createSpinner(
    'Resolving dependencies...',
  )
  resolveSpinner.start()

  const resolution = await resolveComponents(
    config,
    componentNames,
  )
  resolveSpinner.succeed('Dependencies resolved')

  // Show plan
  const allNames = getComponentNames(resolution)
  const deps = getDependencyComponents(resolution)

  logger.break()
  console.log(chalk.bold('Components to add:'))
  for (const { entry, isDirectRequest } of resolution.components) {
    const suffix = isDirectRequest
      ? ''
      : chalk.dim(` (dependency)`)
    console.log(`  ${chalk.green('+')} ${entry.name}${suffix}`)
  }

  if (resolution.utils.length > 0) {
    logger.break()
    console.log(chalk.bold('Utilities to copy:'))
    console.log(
      `  ${resolution.utils.map((u) => `${u}.ts`).join(', ')}`,
    )
  }

  const npmDeps = Object.keys(resolution.npmDependencies)
  const optionalDeps = Object.keys(
    resolution.optionalNpmDependencies,
  )

  if (npmDeps.length > 0 || optionalDeps.length > 0) {
    logger.break()
    console.log(chalk.bold('npm packages:'))
    for (const pkg of npmDeps) {
      console.log(`  ${chalk.green('+')} ${pkg}`)
    }
    for (const pkg of optionalDeps) {
      console.log(
        `  ${chalk.green('+')} ${pkg} ${chalk.dim('(optional)')}`,
      )
    }
  }

  logger.break()

  if (options.dryRun) {
    logger.info('Dry run complete. No files were written.')
    return
  }

  // Confirm
  const { proceed } = await prompts({
    type: 'confirm',
    name: 'proceed',
    message: 'Proceed with installation?',
    initial: true,
  })

  if (!proceed) {
    logger.info('Cancelled.')
    return
  }

  // Detect package manager
  const project = await detectProject(cwd)

  // Install
  await installComponents({
    config,
    cwd,
    resolution,
    packageManager: project.packageManager,
    force: options.force,
  })

  logger.break()
  logger.success(
    `Added ${allNames.length} component(s): ${allNames.join(', ')}`,
  )
  logger.break()
}
