import { reactive, readonly, ref, computed, watchEffect } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useFuse, UseFuseOptions } from '@vueuse/integrations/useFuse'
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

export function useCmdBarState() {
  const { emitter } = useCmdBarEvent()

  function initState(initialGroups: Group[]): void {
    state.groups = initialGroups.filter((group) => group.visible !== false)
    state.commands = state.groups.flatMap(
      (group) =>
        group.commands?.map((command) => ({
          ...command,
          group: group.key
        })) ?? []
    )
    selectFirstCommand()
  }

  function resetState(): void {
    state.query = ''
    state.results = []
  }

  function setLoop(loop: boolean): void {
    state.loop = loop
  }

  async function toggleGroup(groupKey: string | null, multiSelect: boolean): Promise<void> {
    if (state.selectedGroups.has(groupKey)) {
      state.selectedGroups.delete(groupKey)
    } else {
      if (!multiSelect) {
        state.selectedGroups.clear()
      }
      state.selectedGroups.add(groupKey)
    }

    emitter.emit('filterChange', Array.from(state.selectedGroups))

    if (state.query !== '') {
      await updateQuery(state.query)
    } else {
      state.results = []
    }

    selectFirstCommand()
  }

  const resultsEmpty = computed(() => state.query !== '' && state.results.length === 0)
  const resultsNotEmpty = computed(() => state.query !== '' && state.results.length > 0)

  const displayedCommands = computed(() => {
    if (resultsNotEmpty.value) {
      return state.results.filter(
        (command) =>
          state.selectedGroups.size === 0 ||
          state.selectedGroups.has(null) ||
          state.selectedGroups.has(command.group ?? null)
      )
    } else if (resultsEmpty.value) {
      return []
    }

    if (state.selectedGroups.size === 0 || state.selectedGroups.has(null)) {
      return state.commands
    } else {
      return state.commands.filter((command) => state.selectedGroups.has(command.group ?? null))
    }
  })

  const currentCommandIndex = computed(() => {
    return displayedCommands.value.findIndex((command) => command.key === state.selectedCommandKey)
  })

  function selectCommand(commandKey: string): void {
    const commands = displayedCommands.value
    const selectedCommand = commands.find((command) => command.key === commandKey)

    if (selectedCommand) {
      state.selectedCommandKey = commandKey
      emitter.emit('selected', selectedCommand)
    } else {
      console.warn(`Command with key ${commandKey} not found in displayed commands`)
      selectFirstCommand()
    }
  }

  function nextCommand(): void {
    const commands = displayedCommands.value
    if (commands.length === 0) {
      selectFirstCommand()
      return
    }

    const nextIndex = currentCommandIndex.value + 1
    if (nextIndex < commands.length) {
      selectCommand(commands[nextIndex].key)
    } else if (state.loop) {
      selectCommand(commands[0].key)
    }
  }

  function prevCommand(): void {
    const commands = displayedCommands.value
    if (commands.length === 0) {
      selectFirstCommand()
      return
    }

    const prevIndex = currentCommandIndex.value - 1
    if (prevIndex >= 0) {
      selectCommand(commands[prevIndex].key)
    } else if (state.loop) {
      selectCommand(commands[commands.length - 1].key)
    }
  }

  function selectFirstCommand(): void {
    const commands = displayedCommands.value

    if (commands.length > 0) {
      selectCommand(commands[0].key)
    } else {
      state.selectedCommandKey = null
      emitter.emit('selected', null)
    }
  }

  function executeCommand(): void {
    const command = findNodeByKey(state.commands, state.selectedCommandKey)
    if (command) {
      emitter.emit('executed', command)
      command.action?.()
    }
  }

  async function updateQuery(
    query: string,
    fuseOptions?: Partial<UseFuseOptions<Command>>
  ): Promise<void> {
    await debouncedUpdateQuery(query, fuseOptions)
  }

  function clearQuery(): void {
    state.query = ''
    state.results = []
    selectFirstCommand()
  }

  const debouncedUpdateQuery = useDebounceFn(
    async (query: string, fuseOptions?: Partial<UseFuseOptions<Command>>) => {
      state.isLoading = true
      if (fuseOptions) state.fuseOptions = fuseOptions
      state.query = query
      if (query === '') {
        state.results = []
        selectFirstCommand()
        return
      }
      state.results = await search(query)
      selectFirstCommand()
      state.isLoading = false
    },
    200
  )

  async function search(query: string) {
    const relevantGroups = getGroupsToSearch(state.groups)
    const asyncGroups = relevantGroups.filter((group) => !!group.search)
    const asyncResults = await asyncSearch(query, asyncGroups)
    const syncGroups = relevantGroups.filter((group) => !group.search) as Group[]
    let commandsToSearch = syncGroups.flatMap(
      (group) =>
        (group.commands ?? []).map((command) => ({ ...command, group: group.key })) as Command[]
    )
    if (Array.isArray(asyncResults) && asyncResults.length > 0) {
      commandsToSearch = commandsToSearch.concat(asyncResults)
    }
    return fuzzySearch(query, commandsToSearch)
  }

  function fuzzySearch(query: string, commands: Command[]) {
    const { results } = useFuse(query, ref(commands), state.fuseOptions ?? {})
    return results.value.map((result) => result.item) as Command[]
  }

  async function asyncSearch(query: string, groups: Group[]) {
    if (!groups.length) return []
    const results = await Promise.all(
      groups.map(async (group: Group) => {
        const commands = await group.search!(query)
        return commands.map((command) => ({
          ...command,
          group: group.key
        }))
      })
    )
    return results.flat() as Command[]
  }

  function getGroupsToSearch(groups: Group[]): Group[] {
    if (state.selectedGroups.has(null)) return groups
    return groups.filter((group) => state.selectedGroups.has(group.key))
  }

  return {
    state: readonly(state),
    initState,
    resetState,
    setLoop,
    toggleGroup,
    selectCommand,
    nextCommand,
    prevCommand,
    executeCommand,
    updateQuery,
    clearQuery,
    displayedCommands,
    resultsEmpty
  }
}
