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
  return showChildren.value ? store?.getChildren() ?? [] : store?.state.filteredCommands
})

/**
 * Keybindings
 */
whenever(keys.Tab, () => {
  // check if both shift and tab are pressed
  whenever(back, () => {
    showChildren.value = false
    return
  })
  showChildren.value = true
  // reset search term
  store?.setSearchTerm('')
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
