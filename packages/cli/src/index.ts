import { Command } from 'commander'
import { initCommand } from './commands/init'
import { addCommand } from './commands/add'
import { updateCommand } from './commands/update'
import { listCommand } from './commands/list'
import { doctorCommand } from './commands/doctor'
import { logger } from './lib/logger'

const program = new Command()

program
  .name('onlynative')
  .description(
    'Add OnlyNative UI components to your React Native project',
  )
  .version('0.1.0')

program
  .command('init')
  .description('Initialize your project for OnlyNative UI')
  .action(async () => {
    try {
      await initCommand(process.cwd())
    } catch (error) {
      handleError(error)
    }
  })

program
  .command('add')
  .description('Add components to your project')
  .argument('<components...>', 'Component names to add')
  .option('-f, --force', 'Overwrite existing components', false)
  .option(
    '-d, --dry-run',
    'Show what would be installed without making changes',
    false,
  )
  .action(async (components: string[], options) => {
    try {
      await addCommand(components, process.cwd(), {
        force: options.force,
        dryRun: options.dryRun,
      })
    } catch (error) {
      handleError(error)
    }
  })

program
  .command('update')
  .description('Update installed components to the latest version')
  .argument('[components...]', 'Component names to update')
  .option(
    '-a, --all',
    'Update all installed components',
    false,
  )
  .option(
    '-d, --dry-run',
    'Show diff without applying changes',
    false,
  )
  .action(async (components: string[], options) => {
    try {
      await updateCommand(components, process.cwd(), {
        all: options.all,
        dryRun: options.dryRun,
      })
    } catch (error) {
      handleError(error)
    }
  })

program
  .command('list')
  .description('List available components')
  .action(async () => {
    try {
      await listCommand(process.cwd())
    } catch (error) {
      handleError(error)
    }
  })

program
  .command('doctor')
  .description('Check your project for issues')
  .action(async () => {
    try {
      await doctorCommand(process.cwd())
    } catch (error) {
      handleError(error)
    }
  })

function handleError(error: unknown): void {
  if (error instanceof Error) {
    logger.error(error.message)
  } else {
    logger.error('An unexpected error occurred.')
  }
  process.exit(1)
}

program.parse()
