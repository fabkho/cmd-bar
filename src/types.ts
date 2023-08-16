export type State = {
  selectedItemIndex: number
  searchTerm: string
  items: Record<string, any>
  filteredItems: Record<string, any>
}

export interface CmdBarStore {
  state: Readonly<State>
  nextItem(): void
  prevItem(): void
  setSearchTerm(term: string): void
  setItems(newItems: Record<string, any>): void
  setFilteredItems(newItems: string[]): void
  resetState(): void
}
