<script setup lang="ts">
import CmdBarItems from './CmdBarItems.vue'
import CmdBarGroup from './CmdBarGroup.vue'
import CmdBarResults from './CmdBarResults.vue'
import { useCmdBarEvent } from '../composables/useCmdBarEvent'
import { computed, nextTick, ref, watch } from 'vue'
import { Command } from '../types'
import type { Group } from '../types'
import { useCmdBarState } from '../composables/useCmdBarState'

const { loop = false, resultsHeader = 'Results' } = defineProps<{
  loop?: boolean
  resultsHeader?: string | null
}>()

defineSlots<{
  default(props: { command: Command }): any
  loading(): any
  results(props: { command: Command }): any
  'no-results'(): any
  preview(props: { activeCommand: Command | null }): any
}>()

const { state, setLoop, resultsEmpty } = useCmdBarState()
setLoop(loop ?? false)

const activeCommand = ref<Command | null>(null)
const listRef = ref<HTMLElement | null>(null)

// Filter groups based on selected groups in the store
const filteredGroups = computed<Group[]>(() => {
  const selectedGroups = state.selectedGroups
  const allGroups = state.groups as Group[]
  return selectedGroups.has(null)
    ? allGroups
    : allGroups.filter((group) => selectedGroups.has(group.key))
})

const isSearching = computed(() => state.query.length > 0)

// Scroll handling
const scrollSelectedIntoView = () => {
  const selectedId = state.selectedCommandKey
  const item = listRef.value?.querySelector(`[data-id="${selectedId}"]`) as HTMLElement

  if (item?.parentElement?.firstElementChild === item) {
    item?.closest('.group')?.querySelector('.group__label')?.scrollIntoView({ block: 'nearest' })
    return
  }
  item?.scrollIntoView({ block: 'nearest' })
}

// Event handling
const { emitter } = useCmdBarEvent()
emitter.on('selected', (command: Command | null) => {
  activeCommand.value = command
})

watch(
  () => state.selectedCommandKey,
  (newVal) => {
    if (newVal) {
      nextTick(scrollSelectedIntoView)
    }
  }
)
</script>

<template>
  <div ref="listRef" class="grouped-list" tabindex="-1">
    <!-- Search Results View -->
    <CmdBarResults v-if="isSearching" :results-header="resultsHeader">
      <template #loading>
        <slot name="loading">
          <div class="loading-animation">Loading...</div>
        </slot>
      </template>

      <template #no-results>
        <slot name="no-results">
          <div>Nothing found</div>
        </slot>
      </template>

      <template #default="{ command }">
        <slot name="results" :command="command">
          <slot name="default" :command="command" />
        </slot>
      </template>
    </CmdBarResults>

    <!-- Default Group View -->
    <ul v-else data-cmd-bar-items class="list-items">
      <li v-for="group in filteredGroups" :key="group.key" class="group">
        <h2 v-if="group.label && group.commands?.length" class="group__label">
          {{ group.label }}
        </h2>
        <CmdBarGroup :group="group">
          <template #default="{ command }">
            <slot :command="command" />
          </template>
        </CmdBarGroup>
      </li>
    </ul>
  </div>

  <slot name="preview" :active-command="activeCommand" />
</template>
