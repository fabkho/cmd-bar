<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'
import store from '@/useCmdBarState'
import { useMagicKeys, whenever } from '@vueuse/core'

const showChildren = ref<boolean>(false)
const keys = useMagicKeys()
const back = keys['Shift+Tab']

const isSelectedItem = computed(() => {
  return (id: string) => {
    return store?.state.selectedCommandId === id
  }
})

const visibleItems = computed(() => {
  console.log('visibleItems computed')
  return store?.state.visibleCommands
})

/**
 * Keybindings
 */
whenever(keys.Tab, () => {
  if (keys.Shift.value) return
  store?.filterCommands(true)
  // reset search term
  store?.resetSearchTerm()
})
whenever(back, () => {
  showChildren.value = false
  store?.filterCommands()
  return
})
</script>

<template>
  <ul data-cmd-bar-items class="cmd-bar__items">
    <li
      data-cmd-bar-item
      v-for="item in visibleItems"
      class="cmd-bar__items__item"
      :class="{ selected: isSelectedItem(item.id) }"
    >
      <slot :item="item" />
    </li>
  </ul>
</template>
