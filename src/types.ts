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

// dummy data of 5 items for the CmdBar (id, title, icon, actions)
// the icon is a link to a random unsplash image https://source.unsplash.com/random/300×300
// actions are empty for now
export const items = [
  {
    id: 1,
    title: 'New',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 2,
    title: 'Open',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 3,
    title: 'Save',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 4,
    title: 'Save As',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 5,
    title: 'Export',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: []
  }
]
