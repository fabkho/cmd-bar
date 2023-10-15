export type State = {
  selectedCommandId: string | null
  selectedGroups: Set<string>
  parentCommandId: string | null
  query: string
  commands: Commands
  groupedCommands: Group[]
  filteredGroupedCommands: Group[]
  filteredCommands: Commands
  groupLoadingStates: Record<string, boolean>
}

export interface Command {
  id: string
  leading: string
  label: string
  groups?: string[]
  action?: () => void
  /**
   * Format is based on useMagicKeys.
   * @example
   * 'Enter'
   * 'Ctrl+N'
   * 'Ctrl+Shift+P'
   */
  shortcut?: string
  group?: string
  score?: number
  // matches?: (FuseSortFunctionMatch | FuseSortFunctionMatchList)[]
  [key: string]: any
}
export interface Group {
  key: string
  commands: Command[]
  [key: string]: any
}

export type CommandNode = Command & {
  children?: CommandNode[]
}

export type Commands = CommandNode[]
