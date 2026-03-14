import chalk from 'chalk'
import prompts from 'prompts'
import { execa } from 'execa'
import {
  configExists,
  DEFAULT_CONFIG,
  writeConfig,
} from '../lib/config'
import { detectProject, getInstallCommand } from '../lib/detector'
import { createSpinner, logger } from '../lib/logger'
import type { OnlyNativeConfig } from '../lib/types'

export async function initCommand(cwd: string): Promise<void> {
  logger.break()

  // Check if already initialized
  if (await configExists(cwd)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message:
        'onlynative.json already exists. Overwrite?',
      initial: false,
    })

    if (!overwrite) {
      logger.info('Init cancelled.')
      return
    }
  }

  // Detect project
  const spinner = createSpinner('Detecting project...')
  spinner.start()
  const project = await detectProject(cwd)
  spinner.stop()

  if (project.type === 'unknown') {
    logger.error(
      'No React Native or Expo project detected.',
    )
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
  let defaultComponentsAlias =
    DEFAULT_CONFIG.aliases.components
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

  // Interactive prompts
  const answers = await prompts([
    {
      type: 'text',
      name: 'componentsAlias',
      message: 'Where should components be installed?',
      initial: defaultComponentsAlias,
    },
    {
      type: 'text',
      name: 'libAlias',
      message: 'Where should utility files be placed?',
      initial: defaultLibAlias,
    },
  ])

  if (!answers.componentsAlias || !answers.libAlias) {
    logger.info('Init cancelled.')
    return
  }

  // Write config
  const config: OnlyNativeConfig = {
    ...DEFAULT_CONFIG,
    aliases: {
      components: answers.componentsAlias,
      lib: answers.libAlias,
    },
  }

  await writeConfig(cwd, config)
  logger.success('Created onlynative.json')

  // Install @onlynative/core
  const { installCore } = await prompts({
    type: 'confirm',
    name: 'installCore',
    message: 'Install @onlynative/core?',
    initial: true,
  })

  if (installCore) {
    const installSpinner = createSpinner(
      'Installing @onlynative/core...',
    )
    installSpinner.start()

    const command = getInstallCommand(
      project.packageManager,
      ['@onlynative/core'],
    )
    const [cmd, ...args] = command.split(' ')

    try {
      await execa(cmd, args, { cwd })
      installSpinner.succeed('Installed @onlynative/core')
    } catch {
      installSpinner.fail(
        'Failed to install @onlynative/core',
      )
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
