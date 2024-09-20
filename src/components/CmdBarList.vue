<script setup lang="ts">
import CmdBarItems from '@/Users/fabiankirchhoff/code/cmd-bar/src/components/CmdBarItems.vue'
import { useCmdBarEvent } from '../composables/useCmdBarEvent'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Command } from '../types'
import type { Group } from '../types'
import { useCmdBarState } from '../composables/useCmdBarState'
import CmdBarGroup from './CmdBarGroup.vue'

const { loop = false } = defineProps<{
  loop?: boolean
}>()

defineSlots<{
  default(props: { command: Command }): any
  loading(): any
  results(props: { command: Command }): any
  'no-results'(): any
  preview(props: { activeCommand: Command | null }): any
}>()

useCmdBarState.setLoop(loop)

const activeCommand = ref<Command | null>(null)
const listRef = ref<HTMLElement | null>(null)

// Filter groups based on selected groups in the store
const filteredGroups = computed<Group[]>(() => {
  const selectedGroups = useCmdBarState?.state.selectedGroups
  const allGroups = useCmdBarState?.state.groups as Group[]

  // If no group is selected, return all groups
  if (selectedGroups.has(null)) {
    return allGroups
  }

  // Return only groups that are selected
  return allGroups.filter((group) => selectedGroups.has(group.key))
})

const results = computed(() => {
  return useCmdBarState?.state.results
})
const hasQuery = computed(() => useCmdBarState?.state.query !== '')

const isLoading = computed(() => useCmdBarState.state.isLoading)
const showNoResults = computed(
  () => !isLoading.value && results.value.length === 0 && hasQuery.value
)

/* handle scroll to selected item */
const getSelectedItem = () => {
  const selectedId = useCmdBarState?.state.selectedCommandId
  return listRef.value?.querySelector(`[data-id="${selectedId}"]`) as HTMLElement
}

const scrollSelectedIntoView = () => {
  const item = getSelectedItem()
  // if item is first element of group, make sure header/label is in view
  if (item?.parentElement?.firstElementChild === item) {
    item?.closest('.group')?.querySelector('.group__label')?.scrollIntoView({ block: 'nearest' })
    return
  }
  item?.scrollIntoView({ block: 'nearest' })
}

const { emitter } = useCmdBarEvent()

emitter.on('selected', (command: Command) => {
  activeCommand.value = command
})

watch(
  () => useCmdBarState?.state.selectedCommandId,
  (newVal) => {
    if (newVal) {
      nextTick(scrollSelectedIntoView)
    }
  }
)
</script>

<template>
  <div ref="listRef" class="grouped-list">
    <ul v-if="hasQuery" data-cmd-bar-items class="results">
      <li v-if="isLoading">
        <slot name="loading">
          <div class="loading-animation">Loading...</div>
        </slot>
      </li>
      <CmdBarItems v-else-if="results.length" :commands="results">
        <template #default="{ command }">
          <slot name="results" :command="command">
            <!-- render default slot if no results slot is provided -->
            <slot name="default" :command="command" />
          </slot>
        </template>
      </CmdBarItems>
      <li v-else-if="showNoResults">
        <slot name="no-results">
          <div class="no-results">Nothing found</div>
        </slot>
      </li>
    </ul>
    <ul v-else data-cmd-bar-items class="list-items">
      <li v-for="group in filteredGroups" :key="group.key" class="group">
        <h2
          v-if="group.label && group.commands && group.commands?.length > 0"
          ref="labelRef"
          class="group__label"
        >
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

<style scoped lang="scss"></style>
