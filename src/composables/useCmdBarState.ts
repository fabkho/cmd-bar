import { useDebounceFn } from '@vueuse/core'
import { useFuse, UseFuseOptions } from '@vueuse/integrations/useFuse'
import { reactive, readonly, ref } from 'vue'
import type { Command, Group, State } from '../types'
import { findNodeById } from '../utils'
import { useCmdBarEvent } from './useCmdBarEvent'

const state = reactive<State>({
  selectedCommandId: null,
  parentCommandId: null,
  query: '',
  groupedCommands: [] as Group[],
  filteredCommands: [] as Command[],

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
  // filteredCommands: [] as Command[],
})

const useCmdBarState = {
  state: readonly(state),

  /**
   * Initializes the state with the provided groups.
   *
   */
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

  resetState(): void {
    state.selectedCommandId = null
    state.query = ''
    state.results = []
  },

  selectCommand(commandId: string): void {
    state.selectedCommandId = commandId
  },

  // idea: introduce a filter state which is used in the list to only show the filtered commands (no need to store the filtered commands in the state)
  toggleGroup(groupKeys: string, multiSelect: boolean): void {
    if (state.selectedGroups.has(groupKeys)) {
      state.selectedGroups.delete(groupKeys)
    } else {
      if (!multiSelect) {
        state.selectedGroups.clear()
      }
      state.selectedGroups.add(groupKeys)
    }
  },

  resetFilter(): void {
    state.selectedGroups.clear()
  },

  nextCommand(): void {
    const selectedIndex = getSelectedIndex()
    if (selectedIndex > 0) {
      state.selectedCommandId = state.commands[selectedIndex - 1].id
    }
  },

  prevCommand(): void {
    const selectedIndex = getSelectedIndex()
    if (selectedIndex < state.commands.length - 1) {
      state.selectedCommandId = state.commands[selectedIndex + 1].id
    }
  },

  /**
   * Executes the selected command.
   *
   * @event clicked
   */
  executeCommand(): void {
    const { emitter } = useCmdBarEvent()

    const command = findNodeById(state.commands, state.selectedCommandId)
    if (command) {
      emitter.emit('clicked', command)
      command.action?.()
    }
  },

  /**
   * Updates the query and performs a search.
   */
  async updateQuery(query: string, fuseOptions?: Partial<UseFuseOptions<Command>>): Promise<void> {
    state.query = query
    if (query === '') {
      state.results = []
      selectFirstCommand()
      return
    }

    const results = await search(query, fuseOptions)

    // If no results are found, add a placeholder command
    if (results.length === 0) {
      state.results = [
        {
          id: 'placeholder',
          label: 'No results found',
          action: () => {}
        }
      ] as Command[]
    }

    state.results = results

    selectFirstCommand()
  },

  clearQuery(): void {
    state.query = ''
    state.results = []
    selectFirstCommand()
  }
}

/**
 * **Strategy:**
 * 1. Filter out async groups and perform a debounced search on them.
 * 2. Filter out sync groups and retrieve their commands.
 * 3. Combine the results from async groups with sync group commands.
 * 4. Perform a fuzzy search on the combined results and store them in the state.
 *
 * @param query
 * @param fuseOptions - Optional configuration for the Fuse.js fuzzy search.
 * @returns The filtered list of commands based on fuzzy search results.
 */
const search = async (query: string, fuseOptions?: Partial<UseFuseOptions<Command>>) => {
  const asyncGroups = state.groups.filter((group) => !!group.search)

  // Perform debounced search on async groups and get results
  const asyncResults = await debouncedSearch(query, asyncGroups)

  const syncGroups = state.groups.filter((group) => !group.search) as Group[]

  // Retrieve all commands from sync groups
  let commandsToSearch: Command[] = syncGroups.flatMap((group) => group.commands ?? [])

  // Merge async results (if any) with the sync group commands
  if (Array.isArray(asyncResults) && asyncResults.length > 0) {
    commandsToSearch = commandsToSearch.concat(asyncResults)
  }

  // Perform fuzzy search on combined commands from async and sync groups
  return fuzzySearch(query, commandsToSearch, fuseOptions)
}

/**
 * Performs a fuzzy search on the provided list of commands using Fuse.js.
 *
 * @returns The filtered list of commands based on fuzzy search results.
 */
const fuzzySearch = (
  query: string,
  commands: Command[],
  fuseOptions?: Partial<UseFuseOptions<Command>>
) => {
  const { results } = useFuse(query, ref(commands), fuseOptions)

  return results.value.map((result) => result.item) as Command[]
}

/**
 * Performs a debounced search across multiple asynchronous groups.
 *
 * @returns A flat array of commands from all groups.
 */
const debouncedSearch = useDebounceFn(async (query: string, groups: Group[]) => {
  if (!groups.length) {
    return []
  }

  // Perform the search on all groups and return the combined results as a flat array
  return await Promise.all(
    groups.map(async (group: Group) => {
      const commands = await group.search!(query)
      // Attach the group key to each command for context
      return commands.map((command) => ({
        ...command,
        group: group.key
      }))
    })
  ).then((results) => results.flat() as Command[])
}, 200)

/**
 * *Helper* function to get the index of the selected command
 */
function getSelectedIndex(): number {
  return state.commands.findIndex((command) => command.id === state.selectedCommandId)
}

/**
 * *Helper* to select the first command in the first group
 *
 * @event selected
 */
function selectFirstCommand(): void {
  const { emitter } = useCmdBarEvent()

  let firstCommand: Command | null
  if (state.results.length > 0) {
    firstCommand = state.results[0]
  } else {
    firstCommand = state.groups[0]?.commands?.[0] ?? null
  }

  if (firstCommand) {
    state.selectedCommandId = firstCommand.id
    emitter.emit('selected', firstCommand as Command)
  } else {
    console.warn('No command found, by trying to select the first command in the first group')
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

export { useCmdBarState }
