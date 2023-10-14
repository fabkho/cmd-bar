import { useDebounceFn } from '@vueuse/core'
import { useFuse, UseFuseOptions } from '@vueuse/integrations/useFuse'
import { ComputedRef, reactive, readonly, ref, watch } from 'vue'
import type { Commands, Group, State } from './types'
import { findNodeById } from './utils'

const state = reactive<State>({
  selectedCommandId: null,
  selectedGroups: new Set<string>(),
  parentCommandId: null,
  query: '',
  commands: [] as Commands,
  groupedCommands: [] as Group[],
  filteredGroupedCommands: [] as Group[],
  filteredCommands: [] as Commands,
  groupLoadingStates: {} as Record<string, boolean>
})
const useCmdBarState = {
  state: readonly(state),
  initState(initialGroups: Group[]): void {
    const flattenedCommands = initialGroups.flatMap((group) =>
      group.commands.map((command) => ({ ...command, group: group.key }))
    )

    state.groupedCommands = initialGroups
    state.commands = flattenedCommands

    // deep copy of initialGroups, to ensure that the original groups are not modified
    state.filteredGroupedCommands = JSON.parse(JSON.stringify(initialGroups))
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

  resetFilter(): void {
    state.selectedGroups.clear()
    this.filterGroupedCommands()
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

  executeCommand(): void {
    const command = findNodeById(state.commands, state.selectedCommandId)
    command?.action?.()
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

    // if selectedGroups is empty, search all groups and push results to filteredGroupedCommands
    if (state.selectedGroups.size === 0) {
      const fuzzySearchableGroups = state.groupedCommands.filter((group) => !group.search)
      if (fuzzySearchableGroups.length > 0) fuzzySearch(query, fuzzySearchableGroups, fuseOptions)

      const asyncSearchableGroups = state.groupedCommands.filter((group) => !!group.search)
      if (asyncSearchableGroups.length > 0) {
        await debouncedSearch(query, asyncSearchableGroups)
      }
    } else if (state.selectedGroups.size === 1) {
      // else if selectedGroups has only one group, search that group and push results to filteredGroupedCommands
      const group = state.groupedCommands.find((group) => state.selectedGroups.has(group.key))
      if (group && group.search) {
        await debouncedSearch(query, [group])
      } else if (group) {
        fuzzySearch(query, [group], fuseOptions)
        selectFirstCommand()
      } else {
        console.warn(`Group ${state.selectedGroups.values().next().value} not found`)
      }
    } else {
      // else if selectedGroups has multiple groups, search all selected groups and push results to filteredGroupedCommands
      const fuzzySearchableGroups = state.groupedCommands.filter(
        (group) => !group.search && state.selectedGroups.has(group.key)
      )
      const asyncSearchableGroups = state.groupedCommands.filter(
        (group) => !!group.search && state.selectedGroups.has(group.key)
      )

      if (fuzzySearchableGroups.length > 0) fuzzySearch(query, fuzzySearchableGroups, fuseOptions)
      if (asyncSearchableGroups.length > 0) await debouncedSearch(query, asyncSearchableGroups)
    }
  },

  clearQuery(): void {
    state.query = ''
    this.filterGroupedCommands()
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
        return result.matches?.map((match) => group.commands[match.refIndex as number])
      })

    state.filteredGroupedCommands[index].commands = (commands as Commands) ?? []
  })
}

const debouncedSearch = useDebounceFn(async (query, groups) => {
  if (!groups.length) {
    return
  }

  await Promise.all(
    groups.map(async (group: Group) => {
      state.groupLoadingStates[group.key] = true

      // set timpout to simulate async search 5 sec
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const commands = await group.search(query)
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
  state.selectedCommandId = state.filteredGroupedCommands[0]?.commands[0]?.id ?? null
}

/**
 * watcher to assign new flatMap to filteredCommands when filteredGroupedCommands changes
 * and select the first command
 */
watch(
  () => state.filteredGroupedCommands,
  () => {
    state.filteredCommands = state.filteredGroupedCommands.flatMap((group) =>
      group.commands.map((command) => ({ ...command, group: group.key }))
    )

    selectFirstCommand()
  },
  { deep: true }
)

export { useCmdBarState }
