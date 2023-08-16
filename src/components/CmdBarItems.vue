<script setup lang="ts" generic="T">
import { computed } from 'vue'
import { USE_CMD_STATE } from '@/useCmdState'
import type { CmdBarStore } from '@/types'
import { requireInjection } from '@/utils'

defineSlots<{
  default(props: { item: T }): any
}>()

const useCmdState = requireInjection<CmdBarStore>(USE_CMD_STATE)
const filteredItems = computed(() => useCmdState?.state.filteredItems ?? [])

const isSelectedItem = computed(() => {
  return (index: number) => {
    return useCmdState?.state.selectedItemIndex === index
  }
})
</script>

<template>
  <ul data-cmd-bar-items class="cmd-bar__items">
    <li
      data-cmd-bar-item
      v-for="(item, index) in filteredItems"
      class="cmd-bar__items__item"
      :class="{ selected: isSelectedItem(Number(index)) }"
    >
      <slot :item="item" />
    </li>
  </ul>
</template>
