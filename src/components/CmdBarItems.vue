<script setup lang="ts" generic="T">
import { computed } from 'vue'
import store from '@/useCmdBarState'

const isSelectedItem = computed(() => {
  return (id: string) => {
    return store?.state.selectedCommandId === id
  }
})

const visibleItems = computed(() => {
  return store?.state.visibleCommands
})
</script>

<template>
  <ul data-cmd-bar-items class="cmd-bar__items">
    <li
      data-cmd-bar-item
      v-for="item in visibleItems"
      class="cmd-bar__items__item"
      role="option"
      :aria-selected="isSelectedItem(item.id)"
      @mouseover="store?.selectCommand(item.id)"
      @click="store?.executeCommand()"
    >
      <slot :item="item" />
    </li>
  </ul>
</template>
