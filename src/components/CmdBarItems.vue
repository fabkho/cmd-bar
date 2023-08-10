<script setup lang="ts" generic="T">
import { ref, inject } from 'vue'

const props = defineProps<{
  items: T[]
}>()

const selectedIndex = ref(0)

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()

    if (event.key === 'ArrowUp') {
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    } else if (event.key === 'ArrowDown') {
      console.log('down')
      selectedIndex.value = Math.min(selectedIndex.value + 1, props.items.length - 1)
    }
  }
}
</script>

<template>
  <ul data-cmd-bar-items class="cmd-bar__items">
    <li
      data-cmd-bar-item
      v-for="(item, index) in items"
      class="cmd-bar__items__item"
      :class="{ selected: index === selectedIndex }"
    >
      <slot :item="item" />
    </li>
  </ul>
</template>
