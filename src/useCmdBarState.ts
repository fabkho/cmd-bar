import { reactive, readonly } from 'vue'
import type { CommandNode, Commands, State } from '@/types'
import { findNodeById } from '@/utils'
import { nanoid } from 'nanoid'

const state = reactive<State>({
  selectedCommandId: null,
  searchTerm: '',
  commands: [] as Commands,
  visibleCommands: [] as Commands
})

const store = {
  state: readonly(state),
  registerCommands(newItems: Commands): void {
    state.commands = newItems
    // make id unique and assign it to the state
    uniquifyIds()
    // init filtered commands
    this.filterCommands()
  },
  //TODO: addCommands method to add new commands on runtime
  // addCommands(newItems: Commands): void {
  //   state.commands = [...state.commands, ...newItems]
  //   uniquifyIds()
  //   this.filterCommands()
  // },
  //TODO: let user define threshold for search (default 1)
  filterCommands(children = false): void {
    console.log('filterCommands', children)
    if (children) {
      console.log('children')
      state.visibleCommands = getChildren()
    } else if (state.searchTerm && state.searchTerm.length > 1) {
      console.log('search')
      const lowerCaseSearchTerm = state.searchTerm.toLowerCase()
      state.visibleCommands = state.commands.filter((item: CommandNode) =>
        item.title.toLowerCase().includes(lowerCaseSearchTerm)
      )
    } else {
      console.log('no children')
      state.visibleCommands = state.commands
    }
    state.selectedCommandId = state.visibleCommands[0].id
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
        state.selectedCommandId = state.visibleCommands[selectedIndex - 1].id
      }
    }
  },

  prevCommand(): void {
    if (state.selectedCommandId) {
      const selectedIndex = getSelectedIndex()
      if (selectedIndex < state.visibleCommands.length - 1) {
        state.selectedCommandId = state.visibleCommands[selectedIndex + 1].id
      }
    }
  },

  setSearchTerm(term: string): void {
    state.searchTerm = term
    this.filterCommands()
  },
  resetSearchTerm(): void {
    state.searchTerm = ''
  },
  selectItem(id: string): void {
    state.selectedCommandId = id
  }
}

// Private helper function to get the index of the selected command
function getSelectedIndex(): number {
  if (state.selectedCommandId) {
    return state.visibleCommands.findIndex((command) => command.id === state.selectedCommandId)
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
 * helper function to get the children of the selected command
 */
function getChildren(): Commands {
  const command = findNodeById(state.commands, state.selectedCommandId)
  if (command && command.children) {
    return command.children
  }
  return []
}

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
