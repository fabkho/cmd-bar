import { reactive, readonly } from 'vue'
import type { CommandNode, Commands, State } from '@/types'
import { findNodeById } from '@/utils'
import { nanoid } from 'nanoid'

const state = reactive<State>({
  selectedCommandId: null,
  selectedGroups: new Set<string>(),
  parentCommandId: null,
  searchTerm: '',
  commands: [] as Commands,
  filteredCommands: [] as Commands
})

let closeCmdBarFunction = () => {}

const useCmdBarState = {
  state: readonly(state),
  registerCommands(newCommands: Commands, prepend: boolean): void {
    prepend ? state.commands.unshift(...newCommands) : state.commands.push(...newCommands)
    uniquifyIds()

    // init filtered commands
    this.filterCommands()
  },
  filterCommands(children = false): void {
    if (children) {
      applyChildFilter()
    } else if (state.searchTerm) {
      applySearchFilter()
    } else if (state.selectedGroups.size > 0) {
      applyGroupFilter()
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
  toggleGroup(groupName: string, multiSelect: boolean): void {
    if (state.selectedGroups.has(groupName)) {
      state.selectedGroups.delete(groupName)
    } else {
      if (!multiSelect) {
        state.selectedGroups.clear()
      }
      state.selectedGroups.add(groupName)
    }
    this.filterCommands()
  },
  resetGroups(): void {
    state.selectedGroups.clear()
    applyDefaultFilter()
  },
  nextCommand(loop: boolean): void {
    const selectedIndex = getSelectedIndex()
    if (selectedIndex > 0) {
      state.selectedCommandId = state.filteredCommands[selectedIndex - 1].id
    } else if (loop) {
      state.selectedCommandId = state.filteredCommands[state.filteredCommands.length - 1].id
    }
  },

  prevCommand(loop: boolean): void {
    const selectedIndex = getSelectedIndex()
    if (selectedIndex < state.filteredCommands.length - 1) {
      state.selectedCommandId = state.filteredCommands[selectedIndex + 1].id
    } else if (loop) {
      state.selectedCommandId = state.filteredCommands[0].id
    }
  },

  registerToggle(toggleCmdBar: () => void) {
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

  setSearchTerm(term: string, filter: boolean): void {
    state.searchTerm = term
    if (filter) {
      this.filterCommands()
    }
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
    state.filteredCommands = state.filteredCommands.filter((item: CommandNode) =>
      item.title.toLowerCase().includes(lowerCaseSearchTerm)
    )
  }
  selectCommand(state.filteredCommands[0]?.id)
}

/**
 *
 */
function applyGroupFilter(): void {
  state.filteredCommands = state.commands.filter((item: CommandNode) =>
    item.groups.some((group) => state.selectedGroups.has(group))
  )

  selectCommand(state.filteredCommands[0]?.id)
}

/**
 * helper function to apply the default filter
 */
function applyDefaultFilter(): void {
  state.filteredCommands = state.commands
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
  return state.filteredCommands.findIndex((command) => command.id === state.selectedCommandId)
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
    // skip if already prefixed
    if (item.id.startsWith(prefix)) {
      return
    }
    item.id = `${prefix}${item.id + nanoid()}`
    if (item.children) {
      item.children.forEach((child, childIndex) => {
        child.id = `${prefix}${item.id}.${childIndex}`
      })
    }
  })
}
export { useCmdBarState }
