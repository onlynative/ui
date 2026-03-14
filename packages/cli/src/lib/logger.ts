import chalk from 'chalk'
import ora, { type Ora } from 'ora'

export const logger = {
  info(message: string) {
    console.log(chalk.cyan('info'), message)
  },

  success(message: string) {
    console.log(chalk.green('success'), message)
  },

  warn(message: string) {
    console.log(chalk.yellow('warn'), message)
  },

  error(message: string) {
    console.log(chalk.red('error'), message)
  },

  break() {
    console.log()
  },
}

export function createSpinner(text: string): Ora {
  return ora({ text, color: 'cyan' })
}
