import { useDebounceFn } from '@vueuse/core'
import { useFuse, UseFuseOptions } from '@vueuse/integrations/useFuse'
import { reactive, readonly, ref } from 'vue'
import type { Command, Group, State } from '../types'
import { findNodeByKey } from '../utils'
import { useCmdBarEvent } from './useCmdBarEvent'

const state = reactive<State>({
  commands: [] as Command[],
  groups: [] as Group[],
  query: '',
  isLoading: false,
  results: [] as Command[],
  fuseOptions: null,
  selectedCommandKey: null,
  selectedGroups: new Set<string | null>(),
  loop: false
})

const { emitter } = useCmdBarEvent()

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
    state.query = ''
    state.results = []
  },

  setLoop(loop: boolean): void {
    state.loop = loop
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

    emitter.emit('filterChange', Array.from(state.selectedGroups))

    // If there is an active query, rerun the search after group is toggled
    if (state.query !== '') {
      await this.updateQuery(state.query)
    } else {
      // No query, so reset results when groups are changed
      state.results = []
    }

    selectFirstCommand()
  },

  selectCommand(commandKey: string): void {
    selectCommand(commandKey)
  },

  nextCommand(): void {
    const commands = getDisplayedCommands()
    const selectedIndex = getSelectedIndex(commands)

    if (selectedIndex < commands.length - 1) {
      selectCommand(commands[selectedIndex + 1].key)
    } else if (state.loop) {
      selectCommand(commands[0].key)
    }
  },

  prevCommand(): void {
    const commands = getDisplayedCommands()
    const selectedIndex = getSelectedIndex(commands)

    if (selectedIndex > 0) {
      selectCommand(commands[selectedIndex - 1].key)
    } else if (state.loop) {
      selectCommand(commands[commands.length - 1].key)
    }
  },

  /**
   * Executes the selected command.
   *
   * @event clicked
   */
  executeCommand(): void {
    const command = findNodeByKey(state.commands, state.selectedCommandKey)
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
      return
    }

    state.results = await search(query)

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
  let commandsToSearch = syncGroups.flatMap(
    (group) =>
      (group.commands ?? []).map((command) => ({ ...command, group: group.key })) as Command[]
  )
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
function getSelectedIndex(commands: Command[]): number {
  return commands.findIndex((command) => command.key === state.selectedCommandKey)
}

/**
 * Returns the commands to display based on the selected groups and the active query.
 */
function getDisplayedCommands(): Command[] {
  // If there's an active query, use the search results
  if (state.query !== '' && state.results.length > 0) {
    return state.results.filter(
      (command) =>
        state.selectedGroups.size === 0 ||
        state.selectedGroups.has(null) ||
        state.selectedGroups.has(command.group ?? null)
    )
  }

  // No active query; filter commands based on selected groups
  if (state.selectedGroups.size === 0 || state.selectedGroups.has(null)) {
    // No group filtering; return all commands
    return state.commands
  } else {
    // Return commands from selected groups
    return state.commands.filter((command) => state.selectedGroups.has(command.group ?? null))
  }
}

/**
 * *Helper* to select a command and emit the selected event
 *
 * @param commandKey
 * @event selected
 */
function selectCommand(commandKey: string): void {
  if (state.selectedCommandKey === commandKey) return // Command is already selected

  state.selectedCommandKey = commandKey
  const selectedCommand = findNodeByKey(state.commands, commandKey)
  if (selectedCommand) {
    emitter.emit('selected', selectedCommand)
  }
}

/**
 * *Helper* to select the first command in the first group
 */
function selectFirstCommand(): void {
  const commands = getDisplayedCommands()

  if (commands.length > 0) {
    selectCommand(commands[0].key)
  } else {
    state.selectedCommandKey = null
    console.warn('No commands available to select')
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
