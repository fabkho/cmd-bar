import { type InjectionKey, reactive, readonly, provide } from 'vue'
import type { CmdBarStore, State } from '@/types'
import { items } from '@/types'

/**
 * key for injection
 */
export const USE_CMD_STATE: InjectionKey<CmdBarStore> = Symbol('useCmdState')

const initialState: State = {
  selectedItemIndex: 0,
  searchTerm: 'testitest',
  items: items,
  filteredItems: []
}

const state = reactive<State>(initialState)

// Create a store object that provides readonly state and setter methods
const store = {
  state: readonly(state),
  resetState(): void {
    Object.assign(state, initialState)
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
  },
  setItems(newItems: Record<string, any>): void {
    state.items = newItems
  },
  setFilteredItems(newItems: Record<string, any>): void {
    state.filteredItems = newItems
  }
}

export default store
