export type State = {
  selectedCommandIndex: number
  searchTerm: string
  commands: Record<string, any>
  filteredCommands: Record<string, any>
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
