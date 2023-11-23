import { useDebounceFn } from '@vueuse/core'
import { useFuse, UseFuseOptions } from '@vueuse/integrations/useFuse'
import { ComputedRef, reactive, readonly, ref, watch } from 'vue'
import type { Command, Group, State } from './types'
import { useCmdBarEvent } from './useCmdBarEvent'
import { findNodeById } from './utils'

const state = reactive<State>({
  selectedCommandId: null,
  selectedGroups: new Set<string>(),
  parentCommandId: null,
  query: '',
  commands: [] as Command[],
  groupedCommands: [] as Group[],
  filteredGroupedCommands: [] as Group[],
  filteredCommands: [] as Command[],
  groupLoadingStates: {} as Record<string, boolean>
})
const useCmdBarState = {
  state: readonly(state),
  initState(initialGroups: Group[]): void {
    const flattenedCommands = []
    const groupedCommands = []

    for (const group of initialGroups) {
      const commandsWithGroup = group.commands?.map((command) => ({ ...command, group: group.key }))
      flattenedCommands.push(...(commandsWithGroup ?? []))
      groupedCommands.push({ ...group, commands: commandsWithGroup ?? [] })
    }

    state.groupedCommands = groupedCommands
    state.commands = flattenedCommands

    // deep copy of initialGroups, to ensure that the original groups are not modified
    state.filteredGroupedCommands = JSON.parse(JSON.stringify(groupedCommands))
    state.filteredCommands = flattenedCommands

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
    this.filterGroupedCommands()
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
    if (selectedIndex > 0) {
      state.selectedCommandId = state.filteredCommands[selectedIndex - 1].id
    }
  },

  prevCommand(): void {
    const selectedIndex = getSelectedIndex()
    if (selectedIndex < state.filteredCommands.length - 1) {
      state.selectedCommandId = state.filteredCommands[selectedIndex + 1].id
    }
  },

  executeCommand(): void {
    const { emitter } = useCmdBarEvent()

    const command = findNodeById(state.commands, state.selectedCommandId)
    if (command) {
      emitter.emit('clicked', command)
      command.action?.()
    }
  },

  async updateQuery(
    query: string,
    fuseOptions?: ComputedRef<Partial<UseFuseOptions<Group>>>
  ): Promise<void> {
    state.query = query

    if (query === '') {
      this.filterGroupedCommands()
      return
    }

    if (state.selectedGroups.size === 0) {
      // Search all groups
      await searchGroups(query, state.groupedCommands, fuseOptions)
    } else if (state.selectedGroups.size === 1) {
      // Search a single selected group
      const group = state.groupedCommands.find((group) => state.selectedGroups.has(group.key))
      if (group) {
        await searchGroups(query, [group], fuseOptions)
      } else {
        console.warn(`Group ${state.selectedGroups.values().next()} not found`)
      }
    } else {
      // Search multiple selected groups
      const groups = state.groupedCommands.filter((group) => state.selectedGroups.has(group.key))
      await searchGroups(query, groups, fuseOptions)
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
  fuseOptions?: ComputedRef<Partial<UseFuseOptions<Group>>>
) => {
  const fuzzySearchableGroups = groups.filter((group) => !group.search)
  const asyncSearchableGroups = groups.filter((group) => !!group.search)

  if (fuzzySearchableGroups.length > 0) {
    fuzzySearch(query, fuzzySearchableGroups, fuseOptions)
  }

  if (asyncSearchableGroups.length > 0) {
    await debouncedSearch(query, asyncSearchableGroups)
  }
}

const fuzzySearch = (
  query: string,
  groups: Group[],
  fuseOptions?: ComputedRef<Partial<UseFuseOptions<Group>>>
) => {
  const { results } = useFuse(query, ref(groups), fuseOptions)

  groups.forEach((group, index) => {
    const commands = results.value
      .filter((result) => result.item.key === group.key)
      .flatMap((result) => {
        return result.matches?.map((match) => group.commands?.[match.refIndex as number])
      })

    state.filteredGroupedCommands[index].commands = (commands as Command[]) ?? []
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
  return state.filteredCommands.findIndex((command) => command.id === state.selectedCommandId)
}

/**
 * helper to select the first command in the first group
 */
function selectFirstCommand(): void {
  const { emitter } = useCmdBarEvent()

  const firstCommand: Command | null = state.filteredGroupedCommands[0]?.commands?.[0] ?? null
  if (firstCommand) {
    state.selectedCommandId = firstCommand.id
    emitter.emit('selected', firstCommand as Command)
  } else {
    console.warn('No command found, by trying to select the first command')
  }
}

/**
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
