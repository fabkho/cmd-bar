<script setup lang="ts" generic="T">
import { computed } from 'vue'
import store from '@/useCmdBarState'

// defineSlots<{
//   default(props: { item: T }): any
// }>()

const filteredItems = computed(() => store?.state.filteredCommands ?? [])

const isSelectedItem = computed(() => {
  return (index: number) => {
    return store?.state.selectedCommandIndex === index
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
