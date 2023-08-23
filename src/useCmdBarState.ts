import { reactive, readonly } from 'vue'
import type { CommandNode, Commands, State } from '@/types'
import { findNodeById } from '@/utils'
import { nanoid } from 'nanoid'

const state = reactive<State>({
  selectedCommandId: null, //TODO: make store the commandNode instead of the id to avoid the findNodeById
  parentCommandId: null,
  searchTerm: '',
  commands: [] as Commands,
  visibleCommands: [] as Commands,
  visibleCommandsCache: [] as Commands
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
      applyChildFilter()
    } else if (state.searchTerm) {
      applySearchFilter()
    } else {
      applyDefaultFilter()
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

  executeCommand(): void {
    const command = findNodeById(state.commands, state.selectedCommandId)
    console.log('execute', command)
    if (command) {
      command.action()
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
 * helper function to apply the child filter
 */
function applyChildFilter(): void {
  state.visibleCommands = getChildren()
  state.parentCommandId = state.selectedCommandId
  state.selectedCommandId = state.visibleCommands[0].id
}
/**
 * helper function to cache the visible commands and apply the search filter
 */
function applySearchFilter(): void {
  if (state.searchTerm.length > 1) {
    const lowerCaseSearchTerm = state.searchTerm.toLowerCase()
    state.visibleCommandsCache = state.visibleCommands
    state.visibleCommands = state.visibleCommands.filter((item: CommandNode) =>
      item.title.toLowerCase().includes(lowerCaseSearchTerm)
    )
  }
  selectCommand(state.visibleCommands[0]?.id)
}
/**
 * helper function to apply the default filter
 */
function applyDefaultFilter(): void {
  state.visibleCommands =
    state.visibleCommandsCache.length > 0 ? state.visibleCommandsCache : state.commands
  selectCommand(state.visibleCommands[0].id)
}

/**
 * helper function to select a command
 * @param commandId
 */
function selectCommand(commandId: string): void {
  state.selectedCommandId = state.parentCommandId ?? commandId
  state.parentCommandId = null
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
    item.id = `${prefix}${item.id + nanoid()}`
    if (item.children) {
      item.children.forEach((child, childIndex) => {
        child.id = `${prefix}${item.id}.${childIndex}`
      })
    }
  })
}
export default store
