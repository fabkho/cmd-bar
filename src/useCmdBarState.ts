import { reactive, readonly } from 'vue'
import type { CommandNode, Commands, State } from '@/types'
import { findNodeById } from '@/utils'
import { nanoid } from 'nanoid'

const state = reactive<State>({
  selectedCommandId: null,
  parentCommandId: null,
  searchTerm: '',
  commands: [] as Commands,
  filteredCommands: [] as Commands,
  filteredCommandsCache: [] as Commands
})

let closeCmdBarFunction = () => {}

const useCmdBarState = {
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

  selectCommand(commandId: string): void {
    state.selectedCommandId = commandId
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

  registerToggleCmdBar(toggleCmdBar: () => void) {
    closeCmdBarFunction = toggleCmdBar
  },

  executeCommand(): void {
    const command = findNodeById(state.commands, state.selectedCommandId)
    if (command) {
      command.action()
      if (command.actionClosesCmdBar) {
        // close dialog
        closeCmdBarFunction()
      }
    }
  },

  setSearchTerm(term: string): void {
    state.searchTerm = term
    //reset cache
    if (term.length === 0) {
      state.filteredCommandsCache = []
    }
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
  state.filteredCommands = getChildren()
  state.parentCommandId = state.selectedCommandId
  state.selectedCommandId = state.filteredCommands[0].id
}
/**
 * helper function to cache the visible commands and apply the search filter
 */
function applySearchFilter(): void {
  if (state.searchTerm.length > 1) {
    const lowerCaseSearchTerm = state.searchTerm.toLowerCase()
    state.filteredCommandsCache = state.filteredCommands
    state.filteredCommands = state.filteredCommands.filter((item: CommandNode) =>
      item.title.toLowerCase().includes(lowerCaseSearchTerm)
    )
  }
  selectCommand(state.filteredCommands[0]?.id)
}
/**
 * helper function to apply the default filter
 */
function applyDefaultFilter(): void {
  state.filteredCommands =
    state.filteredCommandsCache.length > 0 ? state.filteredCommandsCache : state.commands
  selectCommand(state.filteredCommands[0].id)
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
    return state.filteredCommands.findIndex((command) => command.id === state.selectedCommandId)
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
export { useCmdBarState }
