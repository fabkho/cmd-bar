import type { Command } from '../types'

export function defineCommand(params: Command): Command {
  return params as Command
}
