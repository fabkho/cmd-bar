import { reactive, readonly } from 'vue'
import type { Commands, State } from '@/types'

const state = reactive<State>({
  selectedCommandIndex: 0,
  searchTerm: '',
  commands: [] as Commands,
  filteredCommands: [] as Commands
})

// Create a store object that provides readonly state and setter methods
const store = {
  state: readonly(state),
  setCommands(newItems: Commands): void {
    state.commands = newItems
    this.filterCommands()
  },
  filterCommands(): void {
    if (state.searchTerm && state.searchTerm.length > 1) {
      const lowerCaseSearchTerm = state.searchTerm.toLowerCase()
      state.filteredCommands = state.commands.filter((item: any) =>
        item.title.toLowerCase().includes(lowerCaseSearchTerm)
      )
    } else {
      state.filteredCommands = state.commands
    }
  },
  resetState(): void {
    state.selectedCommandIndex = 0
    state.searchTerm = ''
    this.filterCommands()
  },
  nextCommand(): void {
    if (state.selectedCommandIndex > 0) {
      state.selectedCommandIndex--
    }
  },
  prevCommand(): void {
    if (state.selectedCommandIndex < state.commands.length - 1) {
      state.selectedCommandIndex++
    }
  },
  setSearchTerm(term: string): void {
    state.searchTerm = term
    this.filterCommands()
  }
}

export default store
