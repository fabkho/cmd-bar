<script setup lang="ts" generic="T">
import { computed, nextTick, ref, watchEffect } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'

const listRef = ref<HTMLDivElement>()
const wrapperRef = ref<HTMLDivElement>()
const dialogRef = ref<HTMLDialogElement>()

const isSelectedItem = computed(() => {
  return (id: string) => {
    return useCmdBarState?.state.selectedNode === id
  }
})

const visibleItems = computed(() => {
  return useCmdBarState?.state.filteredCommands
})

// Function to update the list height as a CSS variable
const updateListHeight = () => {
  const listHeight = listRef.value?.offsetHeight
  if (listHeight) {
    nextTick(() => {
      console.log('listHeight', listHeight)
      document.documentElement.style.setProperty('--cmd-list-height', `${listHeight.toFixed(1)}px`)
    })
  }
}

// Use ResizeObserver to watch for dialog resize
const resizeObserver = new ResizeObserver(updateListHeight)

watchEffect(() => {
  const list = listRef.value
  if (list) {
    resizeObserver.observe(list)
  }
})
</script>

<template>
  <div ref="wrapperRef">
    <ul data-cmd-bar-items class="cmd-bar__items" ref="listRef">
      <li
        data-cmd-bar-item
        v-for="item in visibleItems"
        class="cmd-bar__items__item"
        role="option"
        :aria-selected="isSelectedItem(item.id)"
        @mouseover="useCmdBarState?.selectCommand(item.id)"
        @click="useCmdBarState?.executeCommand()"
      >
        <slot :item="item" />
      </li>
    </ul>
  </div>
</template>
