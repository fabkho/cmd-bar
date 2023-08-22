import { reactive, readonly } from 'vue'
import type { CommandNode, Commands, State } from '@/types'
import { findNodeById } from '@/utils'
import { nanoid } from 'nanoid'

const state = reactive<State>({
  selectedCommandId: null,
  parentCommandId: null,
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
  filterCommands(children = false): void {
    if (children) {
      state.visibleCommands = getChildren()
      state.parentCommandId = state.selectedCommandId
    } else if (state.searchTerm && state.searchTerm.length > 1) {
      const lowerCaseSearchTerm = state.searchTerm.toLowerCase()
      state.visibleCommands = state.commands.filter((item: CommandNode) =>
        item.title.toLowerCase().includes(lowerCaseSearchTerm)
      )
      state.selectedCommandId = state.parentCommandId ?? state.visibleCommands[0].id
      state.parentCommandId = null
    } else {
      state.visibleCommands = state.commands
      state.selectedCommandId = state.parentCommandId ?? state.visibleCommands[0].id
      state.parentCommandId = null
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
  }
}

/**
 * helper function to get the index of the selected command
 */
function getSelectedIndex(): number {
  if (state.selectedCommandId) {
    return state.visibleCommands.findIndex((command) => command.id === state.selectedCommandId)
  }
  return -1
}
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
 * helper function to make the id unique
 */
function uniquifyIds(): void {
  const prefix = 'command-'
  state.commands.forEach((item) => {
    item.id = `${prefix}-${item.id + nanoid()}`
    if (item.children) {
      item.children.forEach((child, childIndex) => {
        child.id = `${prefix}-${item.id}.${childIndex}`
      })
    }
  })
}
export default store
