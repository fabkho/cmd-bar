import type { Command } from './types'

export function useDefineCommand(params: Command): Command {
  return params as Command
}
