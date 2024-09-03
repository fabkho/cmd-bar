<script setup lang="ts">
import { useCmdBarEvent } from '../useCmdBarEvent'
import { computed, type ComputedRef, nextTick, ref, watch } from 'vue'
import { Command } from '../types'
import type { Group } from '../types'
import { useCmdBarState } from '../useCmdBarState'
import CmdBarGroup from './CmdBarGroup.vue'

// causes type error!?!?!?
// defineSlots<{
//   default(props: { command: Command }): any
//   preview(props: { command: Command | null }): any
//   loading(props: { group: Group }): any
// }>()

const labelRef = ref<HTMLElement[] | null>(null) // Create a ref for the label element
const activeCommand = ref<Command | null>(null)
const listRef = ref<HTMLElement | null>(null)

/**
 * problem: the group header has to be included in the list to calculate the correct height
 * solution: flatten grouped commands, to use with virtual list
 *
 */
const visibleItems = computed(() => {
  return useCmdBarState?.state.filteredGroupedCommands
}) as ComputedRef<Group[]>

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
  <div class="grouped-list" ref="listRef">
    <ul data-cmd-bar-items class="list-items">
      <li v-for="group in visibleItems" :key="group.key" class="group">
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
