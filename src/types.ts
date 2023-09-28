export type State = {
  selectedCommandId: string | null
  selectedGroups: Set<string>
  parentCommandId: string | null
  query: string
  commands: Commands
  groupedCommands: Group[]
  filteredGroupedCommands: Group[]
  filteredCommands: Commands
}

export interface Command {
  id: string
  leading: string
  label: string
  groups?: string[]
  action?: () => void
  shortcuts?: string[]
  [key: string]: any
}
export interface Group {
  key: string
  active?: string
  inactive?: string
  commands: Command[]
  [key: string]: any
}

export type CommandNode = Command & {
  children?: CommandNode[]
}

export type Commands = CommandNode[]
