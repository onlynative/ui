import path from 'node:path'
import chalk from 'chalk'
import prompts from 'prompts'
import { execa } from 'execa'
import fs from 'fs-extra'
import { createSpinner, logger } from '../lib/logger'
import { DEFAULT_CONFIG } from '../lib/config'
import type { PackageManager } from '../lib/types'

export interface CreateOptions {
  yes?: boolean
}

const TEMPLATE_BASE_URL = `${DEFAULT_CONFIG.registryUrl}/${DEFAULT_CONFIG.registryVersion}/template`

const TEMPLATE_TEXT_FILES = [
  'package.json',
  'app.json',
  'tsconfig.json',
  'babel.config.js',
  '.gitignore',
  'app/_layout.tsx',
  'app/index.tsx',
]

const TEMPLATE_BINARY_FILES = [
  'assets/icon.png',
  'assets/splash.png',
  'assets/adaptive-icon.png',
  'assets/favicon.png',
]

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toDisplayName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function getInstallCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm install'
    case 'yarn':
      return 'yarn'
    case 'bun':
      return 'bun install'
    default:
      return 'npm install'
  }
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }
  return res.text()
}

async function fetchBinary(url: string): Promise<Buffer | null> {
  const res = await fetch(url)
  if (!res.ok) return null
  return Buffer.from(await res.arrayBuffer())
}

export async function createCommand(
  name: string | undefined,
  options: CreateOptions = {},
): Promise<void> {
  logger.break()

  // --- Project name ---
  let projectName: string

  if (name) {
    projectName = slugify(name)
  } else {
    const { value } = await prompts({
      type: 'text',
      name: 'value',
      message: 'Project name:',
      initial: 'my-app',
      validate: (v: string) =>
        v.trim().length > 0 || 'Project name is required',
    })
    if (!value) {
      logger.info('Create cancelled.')
      return
    }
    projectName = slugify(value)
  }

  // --- Display name ---
  let displayName: string

  if (options.yes) {
    displayName = toDisplayName(projectName)
  } else {
    const { value } = await prompts({
      type: 'text',
      name: 'value',
      message: 'Display name (shown on home screen):',
      initial: toDisplayName(projectName),
    })
    if (!value) {
      logger.info('Create cancelled.')
      return
    }
    displayName = value
  }

  // --- Package manager ---
  let packageManager: PackageManager

  if (options.yes) {
    packageManager = 'npm'
  } else {
    const { value } = await prompts({
      type: 'select',
      name: 'value',
      message: 'Package manager:',
      choices: [
        { title: 'npm', value: 'npm' },
        { title: 'yarn', value: 'yarn' },
        { title: 'pnpm', value: 'pnpm' },
        { title: 'bun', value: 'bun' },
      ],
      initial: 0,
    })
    if (value === undefined) {
      logger.info('Create cancelled.')
      return
    }
    packageManager = value
  }

  // --- Check target directory ---
  const targetDir = path.resolve(process.cwd(), projectName)

  if (await fs.pathExists(targetDir)) {
    if (options.yes) {
      logger.warn(`Directory ${chalk.bold(projectName)} already exists.`)
      process.exit(1)
    }

    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory ${chalk.bold(projectName)} already exists. Overwrite?`,
      initial: false,
    })

    if (!overwrite) {
      logger.info('Create cancelled.')
      return
    }

    await fs.remove(targetDir)
  }

  // --- Fetch and write template ---
  const spinner = createSpinner('Creating project...')
  spinner.start()

  try {
    await fs.ensureDir(path.join(targetDir, 'app'))
    await fs.ensureDir(path.join(targetDir, 'assets'))

    // Text files — fetch, apply substitutions, write
    for (const file of TEMPLATE_TEXT_FILES) {
      let content = await fetchText(`${TEMPLATE_BASE_URL}/${file}`)

      if (file === 'package.json') {
        const pkg = JSON.parse(content)
        pkg.name = projectName
        content = JSON.stringify(pkg, null, 2) + '\n'
      }

      if (file === 'app.json') {
        const appJson = JSON.parse(content)
        appJson.expo.name = displayName
        appJson.expo.slug = projectName
        appJson.expo.scheme = projectName
        content = JSON.stringify(appJson, null, 2) + '\n'
      }

      await fs.outputFile(path.join(targetDir, file), content)
    }

    // Binary files (assets) — optional, skip on failure
    for (const file of TEMPLATE_BINARY_FILES) {
      const buffer = await fetchBinary(`${TEMPLATE_BASE_URL}/${file}`)
      if (buffer) {
        await fs.outputFile(path.join(targetDir, file), buffer)
      }
    }

    spinner.succeed('Project created')
  } catch (error) {
    spinner.fail('Failed to create project')
    throw error
  }

  // --- Install dependencies ---
  let shouldInstall = options.yes

  if (!options.yes) {
    const { value } = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Install dependencies?',
      initial: true,
    })
    shouldInstall = value
  }

  if (shouldInstall) {
    const installCmd = getInstallCommand(packageManager)
    const installSpinner = createSpinner('Installing dependencies...')
    installSpinner.start()

    const [cmd, ...args] = installCmd.split(' ')

    try {
      await execa(cmd, args, { cwd: targetDir })
      installSpinner.succeed('Dependencies installed')
    } catch {
      installSpinner.fail('Failed to install dependencies')
      logger.info(
        `Run manually: ${chalk.bold(`cd ${projectName} && ${installCmd}`)}`,
      )
    }
  }

  // --- Done ---
  logger.break()
  logger.success(`Project ${chalk.bold(displayName)} is ready!`)
  logger.break()
  logger.info('Next steps:')
  logger.info(`  cd ${projectName}`)
  if (!shouldInstall) {
    logger.info(`  ${getInstallCommand(packageManager)}`)
  }
  logger.info('  npx expo start')
  logger.break()
}
