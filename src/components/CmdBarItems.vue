<script setup lang="ts" generic="T">
import { computed } from 'vue'
import store from '@/useCmdBarState'

// defineSlots<{
//   default(props: { item: T }): any
// }>()

const filteredItems = computed(() => store?.state.filteredCommands ?? [])

const isSelectedItem = computed(() => {
  return (id: string) => {
    return store?.state.selectedCommandId === id
  }
})
</script>

<template>
  <ul data-cmd-bar-items class="cmd-bar__items">
    <li
      data-cmd-bar-item
      v-for="item in filteredItems"
      class="cmd-bar__items__item"
      :class="{ selected: isSelectedItem(item.id) }"
    >
      <slot :item="item" />
    </li>
  </ul>
</template>
