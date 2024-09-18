import { useDebounceFn } from '@vueuse/core'
import { useFuse, UseFuseOptions } from '@vueuse/integrations/useFuse'
import { reactive, readonly, ref } from 'vue'
import type { Command, Group, State } from '../types'
import { findNodeById } from '../utils'
import { useCmdBarEvent } from './useCmdBarEvent'

const state = reactive<State>({
  selectedCommandId: null,
  query: '',
  isLoading: false,
  groups: [] as Group[],
  commands: [] as Command[],
  results: [] as Command[],
  selectedGroups: new Set<string | null>(),
  fuseOptions: null,

  // TODO: remove after virtual list is refactored
  groupedCommands: [] as Group[]
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

  resetState(): void {
    state.selectedCommandId = null
    state.query = ''
    state.results = []
  },

  selectCommand(commandId: string): void {
    state.selectedCommandId = commandId
  },

  /**
   * Toggles the selected state of a group.
   *
   * @event filterChange
   */
  async toggleGroup(groupKey: string | null, multiSelect: boolean): Promise<void> {
    if (state.selectedGroups.has(groupKey)) {
      state.selectedGroups.delete(groupKey)
    } else {
      if (!multiSelect) {
        state.selectedGroups.clear()
      }
      state.selectedGroups.add(groupKey)
    }

    const { emitter } = useCmdBarEvent()
    emitter.emit('filterChange', Array.from(state.selectedGroups))

    // If there is an active query, rerun the search after group is toggled
    if (state.query !== '') {
      await this.updateQuery(state.query)
    } else {
      // No query, so reset results when groups are changed
      state.results = []
    }
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
   * Updates the query and initiates the debounced search.
   *
   * @
   */
  async updateQuery(query: string, fuseOptions?: Partial<UseFuseOptions<Command>>): Promise<void> {
    state.isLoading = true
    await debouncedUpdateQuery(query, fuseOptions)
    state.isLoading = false
  },

  clearQuery(): void {
    state.query = ''
    state.results = []
    selectFirstCommand()
  }
}

/**
 * Performs a debounced search on the provided query.
 *
 * @param query
 * @param fuseOptions - Optional configuration for the Fuse.js fuzzy search.
 * @returns The filtered list of commands based on fuzzy search results.
 */
const debouncedUpdateQuery = useDebounceFn(
  async (query: string, fuseOptions?: Partial<UseFuseOptions<Command>>) => {
    if (fuseOptions) state.fuseOptions = fuseOptions

    state.query = query
    if (query === '') {
      state.results = []
      selectFirstCommand()
      console.log('=>(useCmdBarState.ts:108) query', query)
      return
    }
    console.log('=>(useCmdBarState.ts:111) query', query)

    state.results = await search(query)
    console.log('=>(useCmdBarState.ts:112) state.results', state.results)

    selectFirstCommand()
  },
  200
)
/**
 * **Strategy:**
 * 1. Filter out async groups and perform a debounced search on them.
 * 2. Filter out sync groups and retrieve their commands.
 * 3. Combine the results from async groups with sync group commands.
 * 4. Perform a fuzzy search on the combined results and store them in the state.
 *
 * @param query
 * @returns The filtered list of commands based on fuzzy search results.
 */
const search = async (query: string) => {
  const relevantGroups = getGroupsToSearch(state.groups)

  // Perform an asynchronous search on async groups and get results
  const asyncGroups = relevantGroups.filter((group) => !!group.search)
  const asyncResults = await asyncSearch(query, asyncGroups)

  // Retrieve all commands from sync groups
  const syncGroups = relevantGroups.filter((group) => !group.search) as Group[]
  let commandsToSearch: Command[] = syncGroups.flatMap((group) => group.commands ?? [])

  // Merge async results (if any) with the sync group commands
  if (Array.isArray(asyncResults) && asyncResults.length > 0) {
    commandsToSearch = commandsToSearch.concat(asyncResults)
  }

  // Perform fuzzy search on combined commands from async and sync groups
  return fuzzySearch(query, commandsToSearch)
}

/**
 * Performs a fuzzy search on the provided list of commands using Fuse.js.
 *
 * @returns The filtered list of commands based on fuzzy search results.
 */
const fuzzySearch = (query: string, commands: Command[]) => {
  const { results } = useFuse(query, ref(commands), state.fuseOptions ?? {})

  return results.value.map((result) => result.item) as Command[]
}

/**
 * Performs an asynchronous search across multiple groups.
 *
 * @returns A flat array of commands from all groups.
 */
const asyncSearch = async (query: string, groups: Group[]) => {
  if (!groups.length) return []

  // Perform the search on all groups and return the combined results as a flat array
  const results = await Promise.all(
    groups.map(async (group: Group) => {
      const commands = await group.search!(query)
      // Attach the group key to each command for context
      return commands.map((command) => ({
        ...command,
        group: group.key
      }))
    })
  )

  return results.flat() as Command[]
}

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

/**
 * Returns the groups to search based on the selected groups
 * @param groups
 */
function getGroupsToSearch(groups: Group[]): Group[] {
  if (state.selectedGroups.has(null)) return groups

  return groups.filter((group) => state.selectedGroups.has(group.key))
}

export { useCmdBarState }
