export type State = {
  selectedCommandId: string | null
  selectedGroups: Set<string>
  parentCommandId: string | null
  searchTerm: string
  /**
   * The full list of root-level commands
   */
  commands: Commands
  groupedCommands: Group[]
  /**
   * The list of commands that are currently visible
   */
  filteredCommands: Commands
}

export interface CmdBarStore {
  state: Readonly<State>
  nextCommand(): void
  prevCommand(): void
  setSearchTerm(term: string): void
  setCommands(newItems: Record<string, any>): void
  setFilteredCommands(newItems: string[]): void
  resetState(): void
}

export interface Command {
  id: string
  leading: string
  label: string
  groups?: string[]
  action?: () => void
  shortcuts?: string[]
  actionClosesCmdBar: boolean
  [key: string]: any
}

export type CommandNode = Command & {
  children?: CommandNode[]
}

export type Commands = CommandNode[]

export interface Group {
  key: string
  active?: string
  inactive?: string
  commands: Command[]
  [key: string]: any
}

//TODO
export interface DataProvider<R> {
  load: () => Promise<R[]>
  transform: (item: R) => Command
}

export type Keybindings = {
  arrowUp: Lowercase<string>
  arrowDown: Lowercase<string>
  enter: Lowercase<string>
}
