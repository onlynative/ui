import chalk from 'chalk'
import { execa } from 'execa'
import prompts from 'prompts'
import { configExists, DEFAULT_CONFIG, writeConfig } from '../lib/config'
import { detectProject, getInstallCommand } from '../lib/detector'
import { createSpinner, logger } from '../lib/logger'
import type { OnlyNativeConfig, PackageManager } from '../lib/types'

export interface InitOptions {
  yes?: boolean
  componentsAlias?: string
  libAlias?: string
  packageManager?: PackageManager
}

export async function initCommand(
  cwd: string,
  options: InitOptions = {},
): Promise<void> {
  logger.break()

  // Check if already initialized
  if (await configExists(cwd)) {
    if (options.yes) {
      logger.info('Overwriting existing onlynative.json')
    } else {
      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'onlynative.json already exists. Overwrite?',
        initial: false,
      })

      if (!overwrite) {
        logger.info('Init cancelled.')
        return
      }
    }
  }

  // Detect project
  const spinner = createSpinner('Detecting project...')
  spinner.start()
  const project = await detectProject(cwd)
  spinner.stop()

  if (project.type === 'unknown') {
    logger.error('No React Native or Expo project detected.')
    logger.info(
      'Make sure you are in a project with react-native or expo in package.json.',
    )
    process.exit(1)
  }

  logger.info(
    `Detected ${chalk.bold(project.type)} project using ${chalk.bold(project.packageManager)}`,
  )

  if (!project.hasTypeScript) {
    logger.warn(
      'TypeScript not detected. OnlyNative components use TypeScript.',
    )
  }

  // Determine default alias based on detected tsconfig paths
  let defaultComponentsAlias = DEFAULT_CONFIG.aliases.components
  let defaultLibAlias = DEFAULT_CONFIG.aliases.lib

  if (project.aliases?.['@']) {
    // User has @/* → src/* configured
    defaultComponentsAlias = '@/components/ui'
    defaultLibAlias = '@/lib'
  } else if (project.aliases?.['~']) {
    // User has ~/* → src/* configured
    defaultComponentsAlias = '~/components/ui'
    defaultLibAlias = '~/lib'
  }

  // Resolve aliases — use explicit flags, then defaults, skip prompts with --yes
  let componentsAlias: string
  let libAlias: string

  if (options.yes) {
    componentsAlias = options.componentsAlias ?? defaultComponentsAlias
    libAlias = options.libAlias ?? defaultLibAlias
  } else {
    const answers = await prompts([
      {
        type: 'text',
        name: 'componentsAlias',
        message: 'Where should components be installed?',
        initial: options.componentsAlias ?? defaultComponentsAlias,
      },
      {
        type: 'text',
        name: 'libAlias',
        message: 'Where should utility files be placed?',
        initial: options.libAlias ?? defaultLibAlias,
      },
    ])

    if (!answers.componentsAlias || !answers.libAlias) {
      logger.info('Init cancelled.')
      return
    }

    componentsAlias = answers.componentsAlias
    libAlias = answers.libAlias
  }

  // Write config
  const config: OnlyNativeConfig = {
    ...DEFAULT_CONFIG,
    aliases: {
      components: componentsAlias,
      lib: libAlias,
    },
  }

  await writeConfig(cwd, config)
  logger.success('Created onlynative.json')

  // Install @onlynative/core
  let installCore = options.yes

  if (!options.yes) {
    const answer = await prompts({
      type: 'confirm',
      name: 'installCore',
      message: 'Install @onlynative/core?',
      initial: true,
    })
    installCore = answer.installCore
  }

  if (installCore) {
    const pm = options.packageManager ?? project.packageManager
    const command = getInstallCommand(pm, ['@onlynative/core'])
    const [cmd, ...args] = command.split(' ')

    logger.break()
    logger.info('Installing @onlynative/core...')
    logger.break()

    try {
      await execa(cmd, args, { cwd, stdio: 'inherit' })
      logger.break()
      logger.success('Installed @onlynative/core')
    } catch {
      logger.break()
      logger.error('Failed to install @onlynative/core')
      logger.info(`Run manually: ${chalk.bold(command)}`)
    }
  }

  logger.break()
  logger.success('Project initialized!')
  logger.info(
    `Add components with: ${chalk.bold('npx onlynative add <component>')}`,
  )
  logger.break()
}
