// import { useFuse } from '@vueuse/integrations/useFuse'
// import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
// import { nanoid } from 'nanoid'
import { useDebounceFn } from '@vueuse/core'
import { useFuse, UseFuseOptions } from '@vueuse/integrations/useFuse'
import { ComputedRef, reactive, readonly, ref } from 'vue'
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
  filteredCommands: [] as Commands
})
const useCmdBarState = {
  state: readonly(state),
  registerState(initialGroups: Group[]): void {
    state.groupedCommands = initialGroups
    // deep copy of initialGroups, to ensure that the original groups are not modified
    state.filteredGroupedCommands = JSON.parse(JSON.stringify(initialGroups))

    state.commands = initialGroups.flatMap((group) =>
      group.commands.map((command) => ({ ...command, group: group.key }))
    )
  },
  filterGroupedCommands(): void {
    if (state.selectedGroups.size === 0) {
      state.filteredGroupedCommands = JSON.parse(JSON.stringify(state.groupedCommands))
    } else {
      state.filteredGroupedCommands = JSON.parse(
        JSON.stringify(state.groupedCommands.filter((group) => state.selectedGroups.has(group.key)))
      )
    }

    state.selectedCommandId = state.filteredGroupedCommands[0]?.commands[0].id
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

  resetGroups(): void {
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
      console.log('selectedGroups has only one group', state.selectedGroups)
      // else if selectedGroups has only one group, search that group and push results to filteredGroupedCommands
      const group = state.groupedCommands.find((group) => state.selectedGroups.has(group.key))
      if (group && group.search) {
        await debouncedSearch(query, [group])
      } else if (group) {
        fuzzySearch(query, [group], fuseOptions)
      } else {
        console.warn(`Group ${state.selectedGroups.values().next().value} not found`)
      }
    } else {
      console.log('selectedGroups has multiple groups', state.selectedGroups)
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
  // set loading to true for every group
  groups.map((group) => (group.loading = true))

  const { results } = useFuse(query, ref(groups), fuseOptions)

  groups.forEach((group, index) => {
    const commands = results.value
      .filter((result) => result.item.key === group.key)
      .flatMap((result) => {
        return result.matches?.map((match) => group.commands[match.refIndex as number])
      })

    state.filteredGroupedCommands[index].commands = (commands as Commands) ?? []
  })

  groups.map((group) => (group.loading = false))
}

const debouncedSearch = useDebounceFn(async (query, groups) => {
  if (!groups.length) {
    return
  }
  await Promise.all(
    groups.map(async (group: Group) => {
      const commands = await group.search(query)
      const groupIndex = state.filteredGroupedCommands.findIndex(
        (filteredGroup) => filteredGroup.key === group.key
      )

      state.filteredGroupedCommands[groupIndex].commands = commands
    })
  )
}, 200)

/**
 * helper function to get the index of the selected command
 */
function getSelectedIndex(): number {
  return state.filteredCommands.findIndex((command) => command.id === state.selectedCommandId)
}

export { useCmdBarState }
