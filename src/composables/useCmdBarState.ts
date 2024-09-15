import { useDebounceFn } from '@vueuse/core'
import { useFuse, UseFuseOptions } from '@vueuse/integrations/useFuse'
import { reactive, readonly, ref, watch } from 'vue'
import type { Command, Group, State } from '../types'
import { findNodeById } from '../utils'
import { useCmdBarEvent } from './useCmdBarEvent'

const state = reactive<State>({
  selectedCommandId: null,
  parentCommandId: null,
  query: '',
  groupedCommands: [] as Group[],
  filteredGroupedCommands: [] as Group[],
  filteredCommands: [] as Command[],
  groupLoadingStates: {} as Record<string, boolean>,

  // Idea:
  // - just store the passed grouped commands in the commands state
  // - store the filtered commands in the results state as a flat array of commands
  //   - reset the results state when the query is empty
  // refactored state
  groups: [] as Group[], // Store original groups
  commands: [] as Command[], // Flattened commands from newGroups
  results: [] as Command[], // Filtered commands based on the search query
  selectedGroups: new Set<string>() // To track selected groups

  // to remove:
  // filteredGroupedCommands: [] as Group[],
  // filteredCommands: [] as Command[],
  // groupLoadingStates: {} as Record<string, boolean>
})
const useCmdBarState = {
  state: readonly(state),
  initState(initialGroups: Group[]): void {
    state.groups = initialGroups

    state.commands = state.groups.flatMap(
      (group) =>
        group.commands?.map((command) => ({
          ...command,
          group: group.key
        })) ?? []
    )

    selectFirstCommand()
  },

  filterGroupedCommands(): void {
    if (state.selectedGroups.size === 0) {
      state.filteredGroupedCommands = JSON.parse(JSON.stringify(state.groupedCommands))
    } else {
      state.filteredGroupedCommands = JSON.parse(
        JSON.stringify(state.groupedCommands.filter((group) => state.selectedGroups.has(group.key)))
      )
    }

    selectFirstCommand()
  },

  resetState(): void {
    state.selectedCommandId = null
    state.query = ''
    state.results = []
  },

  selectCommand(commandId: string): void {
    state.selectedCommandId = commandId
  },

  toggleGroup(groupKeys: string, multiSelect: boolean): void {
    if (state.selectedGroups.has(groupKeys)) {
      state.selectedGroups.delete(groupKeys)
    } else {
      if (!multiSelect) {
        state.selectedGroups.clear()
      }
      state.selectedGroups.add(groupKeys)
    }

    this.filterGroupedCommands()
  },

  resetFilter(): void {
    state.selectedGroups.clear()
    this.filterGroupedCommands()
  },

  nextCommand(): void {
    const selectedIndex = getSelectedIndex()
    console.log('nextCommand', selectedIndex, state.commands)
    if (selectedIndex > 0) {
      state.selectedCommandId = state.commands[selectedIndex - 1].id
      console.log('=>(useCmdBarState.ts:93) state.selectedCommandId', state.selectedCommandId)
    }
  },

  prevCommand(): void {
    const selectedIndex = getSelectedIndex()
    console.log('prevCommand', selectedIndex)
    if (selectedIndex < state.commands.length - 1) {
      state.selectedCommandId = state.commands[selectedIndex + 1].id
    }
  },

  executeCommand(): void {
    const { emitter } = useCmdBarEvent()

    const command = findNodeById(state.commands, state.selectedCommandId)
    console.log('=>(useCmdBarState.ts:109) command', command)
    if (command) {
      emitter.emit('clicked', command)
      command.action?.()
    }
  },

  async updateQuery(query: string, fuseOptions?: Partial<UseFuseOptions<Command>>): Promise<void> {
    state.query = query
    if (query === '') {
      this.filterGroupedCommands()
      return
    }

    const groupsToSearch = getGroupsToSearch()

    if (groupsToSearch) {
      await searchGroups(query, groupsToSearch, fuseOptions)
    }
  },

  clearQuery(): void {
    state.query = ''
    this.filterGroupedCommands()
  }
}

const searchGroups = async (
  query: string,
  groups: Group[],
  fuseOptions?: Partial<UseFuseOptions<Command>>
) => {
  const fuzzySearchableGroups: Group[] = []
  const asyncSearchableGroups: Group[] = []
  groups.forEach((group) => {
    if (group.search) {
      asyncSearchableGroups.push(group)
    } else {
      fuzzySearchableGroups.push(group)
    }
  })

  if (asyncSearchableGroups.length > 0) {
    // TODO: should return the results of the search as a list of commands, which then can be added to the commands of the fuzzySearchableGroups.
    // Which then can be fuzzy searched again to get the final results. (This is needed to get the correct order of the commands)
    await debouncedSearch(query, asyncSearchableGroups)
  }

  if (fuzzySearchableGroups.length > 0) {
    fuzzySearch(query, fuzzySearchableGroups, fuseOptions)
  }
}

const fuzzySearch = (
  query: string,
  groups: Group[],
  fuseOptions?: Partial<UseFuseOptions<Command>> // Assuming Command type is used within Group.commands
) => {
  groups.forEach((group, index) => {
    const { results } = useFuse(query, ref(group.commands || []), fuseOptions)

    state.filteredGroupedCommands[index].commands = results.value.map((result) => result.item)
  })
}

const debouncedSearch = useDebounceFn(async (query, groups) => {
  if (!groups.length) {
    return
  }

  await Promise.all(
    groups.map(async (group: Group) => {
      state.groupLoadingStates[group.key] = true

      const commands = await group.search!(query)
      const groupIndex = state.filteredGroupedCommands.findIndex(
        (filteredGroup) => filteredGroup.key === group.key
      )

      //update group parameter of the commands
      commands.forEach((command) => {
        command.group = group.key
      })

      state.filteredGroupedCommands[groupIndex].commands = commands

      state.groupLoadingStates[group.key] = false
    })
  ).then(() => {
    selectFirstCommand()
  })
}, 200)

/**
 * helper function to get the index of the selected command
 */
function getSelectedIndex(): number {
  return state.commands.findIndex((command) => command.id === state.selectedCommandId)
}

/**
 * helper to select the first command in the first group
 */
function selectFirstCommand(): void {
  const { emitter } = useCmdBarEvent()

  const firstCommand: Command | null = state.groups[0]?.commands?.[0] ?? null
  if (firstCommand) {
    state.selectedCommandId = firstCommand.id
    emitter.emit('selected', firstCommand as Command)
  } else if (state.filteredGroupedCommands.length > 0) {
    console.warn('No command found, by trying to select the first command')
  }
}

function getGroupsToSearch(): Group[] | undefined {
  let groupsToSearch

  if (state.selectedGroups.size === 0) {
    groupsToSearch = state.groupedCommands
  } else if (state.selectedGroups.size === 1) {
    const group = findSingleSelectedGroup()
    if (group) {
      groupsToSearch = [group]
    } else {
      console.warn(`Group ${state.selectedGroups.values().next()} not found`)
    }
  } else {
    groupsToSearch = findMultipleSelectedGroups()
  }

  return groupsToSearch
}

function findSingleSelectedGroup(): Group | undefined {
  return state.groupedCommands.find((group) => state.selectedGroups.has(group.key))
}

function findMultipleSelectedGroups(): Group[] {
  return state.groupedCommands.filter((group) => state.selectedGroups.has(group.key))
}

/**
 * TODO: not needed anymore
 * watcher to assign new flatMap to filteredCommands when filteredGroupedCommands changes
 * and select the first command
 */
watch(
  () => state.filteredGroupedCommands,
  () => {
    state.filteredCommands = state.filteredGroupedCommands.flatMap((group) =>
      (group.commands ?? []).map((command) => ({ ...command, group: group.key }))
    )

    selectFirstCommand()
  },
  { deep: true }
)

export { useCmdBarState }
