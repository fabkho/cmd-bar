import { type InjectionKey, reactive, readonly } from 'vue'
import type { CmdBarStore, State } from '@/types'

/**
 * key for injection
 */
export const USE_CMD_STATE: InjectionKey<CmdBarStore> = Symbol('useCmdState')

const state = reactive<State>({
  selectedItemIndex: 0,
  searchTerm: '',
  items: [],
  filteredItems: []
})

// Create a store object that provides readonly state and setter methods
const store = {
  state: readonly(state),
  setItems(newItems: Record<string, any>): void {
    state.items = newItems
    this.filterItems()
  },
  filterItems(): void {
    if (state.searchTerm && state.searchTerm.length > 1) {
      const lowerCaseSearchTerm = state.searchTerm.toLowerCase()
      state.filteredItems = state.items.filter((item: any) =>
        item.title.toLowerCase().includes(lowerCaseSearchTerm)
      )
    } else {
      state.filteredItems = state.items
    }
  },
  resetState(): void {
    state.selectedItemIndex = 0
    state.searchTerm = ''
    this.filterItems()
  },
  nextItem(): void {
    if (state.selectedItemIndex > 0) {
      state.selectedItemIndex--
    }
  },
  prevItem(): void {
    if (state.selectedItemIndex < state.items.length - 1) {
      state.selectedItemIndex++
    }
  },
  setSearchTerm(term: string): void {
    state.searchTerm = term
    this.filterItems()
  }
}

export default store
