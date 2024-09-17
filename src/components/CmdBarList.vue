<script setup lang="ts">
import CmdBarItems from '@/Users/fabiankirchhoff/code/cmd-bar/src/components/CmdBarItems.vue'
import { useCmdBarEvent } from '../composables/useCmdBarEvent'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Command } from '../types'
import type { Group } from '../types'
import { useCmdBarState } from '../composables/useCmdBarState'
import CmdBarGroup from './CmdBarGroup.vue'

const labelRef = ref<HTMLElement[] | null>(null)
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
    <ul v-if="results.length || hasQuery" data-cmd-bar-items class="results">
      <CmdBarItems v-if="results.length" :commands="results">
        <template #default="{ command }">
          <slot name="results" :command="command" />
        </template>
      </CmdBarItems>
      <slot v-else name="no-results" />
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
          <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </CmdBarGroup>
      </li>
    </ul>
  </div>
  <slot name="preview" :command="activeCommand" />
</template>

<style scoped lang="scss"></style>
