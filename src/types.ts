export type State = {
  selectedCommandId: string | null
  selectedGroups: Set<string>
  parentCommandId: string | null
  searchTerm: string
  /**
   * The full list of root-level commands
   */
  commands: Commands
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
  title: string
  groups: string[]
  description: string
  action: () => void
  actionClosesCmdBar: boolean
}

export type CommandNode = Command & {
  children?: CommandNode[]
}

export type Commands = CommandNode[]

export interface GroupedCommands {
  [groupName: string]: Command[]
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
