import { reactive, readonly } from 'vue'
import type { Commands, Group, State } from '@/types'
import { findNodeById } from '@/utils'
import { nanoid } from 'nanoid'

const state = reactive<State>({
  selectedCommandId: null,
  selectedGroups: new Set<string>(),
  parentCommandId: null,
  query: '',
  commands: [] as Commands,
  groupedCommands: [] as Group[],
  filteredGroupedCommands: [] as Group[],
  filteredCommands: [] as Commands
})

let closeCmdBarFunction = () => {}

const useCmdBarState = {
  state: readonly(state),
  registerGroups(groups: Group[]): void {
    state.groupedCommands = groups
    this.filterGroupedCommands()

    state.commands = groups.flatMap((group) => group.commands)
    this.filterCommands()
  },
  filterCommands(children = false): void {
    if (children) {
      applyChildFilter()
    } else if (state.query) {
      applySearchFilter()
    } else if (state.selectedGroups.size > 0) {
    } else {
      applyDefaultFilter()
    }
  },
  filterGroupedCommands(): void {
    if (state.selectedGroups.size === 0) {
      state.filteredGroupedCommands = state.groupedCommands
      return
    }

    state.filteredGroupedCommands = state.groupedCommands.filter(
      (group) => state.selectedGroups.has('all') || state.selectedGroups.has(group.key)
    )
    state.selectedCommandId = state.filteredGroupedCommands[0]?.commands[0].id
  },
  resetState(): void {
    state.selectedCommandId = null
    state.query = ''
    this.filterCommands()
  },

  selectCommand(commandId: string): void {
    state.selectedCommandId = commandId
  },
  toggleGroup(groupKeys: string, multiSelect: boolean, filter: boolean): void {
    if (state.selectedGroups.has(groupKeys)) {
      state.selectedGroups.delete(groupKeys)
    } else {
      if (!multiSelect) {
        state.selectedGroups.clear()
      }
      state.selectedGroups.add(groupKeys)
    }
    if (filter) this.filterGroupedCommands()
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
    command?.action?.()
  },

  updateQuery(query: string, filter: boolean): void {
    state.query = query
    if (filter) {
      applySearchFilter()
    }
  },
  resetSearchTerm(): void {
    state.query = ''
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
  console.log('applySearchFilter', state.query)
  if (state.query.length > 0) {
    const lowerCaseQuery = state.query.toLowerCase()
    state.filteredGroupedCommands = state.groupedCommands.map((group) => {
      const filteredCommands = group.commands.filter((command) => {
        return command.label.toLowerCase().includes(lowerCaseQuery)
      })
      return { ...group, commands: filteredCommands }
    })
  } else {
    state.filteredGroupedCommands = state.groupedCommands
  }
  selectCommand(state.filteredCommands[0]?.id)
}

/**
 *
 */
// function applyGroupFilter(): void {
//   state.filteredCommands = state.commands.filter((item: CommandNode) =>
//     item.groups.some((group) => state.selectedGroups.has(group))
//   )
//
//   selectCommand(state.filteredCommands[0]?.id)
// }

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
