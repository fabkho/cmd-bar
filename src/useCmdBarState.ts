import { reactive, readonly } from 'vue'
import type { CommandNode, Commands, State } from '@/types'
import { findNodeById } from '@/utils'
import { nanoid } from 'nanoid'

const state = reactive<State>({
  selectedCommandId: null,
  searchTerm: '',
  commands: [] as Commands,
  filteredCommands: [] as Commands
})

const store = {
  state: readonly(state),
  registerCommands(newItems: Commands): void {
    state.commands = newItems
    // make id unique and assign it to the state
    uniquifyIds()
    state.selectedCommandId = state.commands[0].id
    // init filtered commands
    this.filterCommands()
  },
  //TODO: addCommands method to add new commands on runtime
  // addCommands(newItems: Commands): void {
  //   state.commands = [...state.commands, ...newItems]
  //   uniquifyIds()
  //   this.filterCommands()
  // },
  getChildren(): Commands | null {
    const command = findNodeById(state.commands, state.selectedCommandId)
    if (command && command.children) {
      return command.children
    }
    return null
  },
  //TODO: let user define threshold for search (default 1)
  filterCommands(): void {
    if (state.searchTerm && state.searchTerm.length > 1) {
      const lowerCaseSearchTerm = state.searchTerm.toLowerCase()
      state.filteredCommands = state.commands.filter((item: CommandNode) =>
        item.title.toLowerCase().includes(lowerCaseSearchTerm)
      )
    } else {
      state.filteredCommands = state.commands
    }
  },
  resetState(): void {
    state.selectedCommandId = null
    state.searchTerm = ''
    this.filterCommands()
  },
  nextCommand(): void {
    if (state.selectedCommandId) {
      const selectedIndex = getSelectedIndex()
      if (selectedIndex > 0) {
        state.selectedCommandId = state.filteredCommands[selectedIndex - 1].id
      }
    }
  },

  prevCommand(): void {
    if (state.selectedCommandId) {
      const selectedIndex = getSelectedIndex()
      if (selectedIndex < state.filteredCommands.length - 1) {
        state.selectedCommandId = state.filteredCommands[selectedIndex + 1].id
      }
    }
  },

  setSearchTerm(term: string): void {
    state.searchTerm = term
    this.filterCommands()
  }
}

// Private helper function to get the index of the selected command
function getSelectedIndex(): number {
  if (state.selectedCommandId) {
    return state.filteredCommands.findIndex((command) => command.id === state.selectedCommandId)
  }
  return -1
}
//  // make id unique
//     const makeIdUnique = (item: CommandNode): void => {
//       item.id = `command-${item.id + nanoid()}`
//       if (item.children) {
//         item.children.forEach(makeIdUnique)
//       }
//     }

/**
 * makes the id of evey command unique
 */
function uniquifyIds(): void {
  state.commands.forEach((item) => {
    item.id = `command-${item.id + nanoid()}`
    if (item.children) {
      item.children.forEach((child, childIndex) => {
        child.id = `command-${item.id}.${childIndex}`
      })
    }
  })
}
export default store
