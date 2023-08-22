export type State = {
  selectedCommandId: string | null
  parentCommandId: string | null
  searchTerm: string
  /**
   * The full list of root-level commands
   */
  commands: Commands
  /**
   * The list of commands that are currently visible
   */
  visibleCommands: Commands
  /**
   * A cache of the last visible commands
   */
  visibleCommandsCache: Commands
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
  title: string
  leading: string
  actions: string[]
  category: string
  description: string
}

export type CommandNode = Command & {
  children?: CommandNode[]
}

export type Commands = CommandNode[]
