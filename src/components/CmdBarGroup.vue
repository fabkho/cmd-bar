<script setup lang="ts">
import type { Group } from '@/types'
import { useCmdBarState } from '@/useCmdBarState'
import { nextTick, ref, watch, computed } from 'vue'

const props = defineProps<{
  group: Group
  itemHeightInPixel: number
  containerHeight: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)

const isSelectedItem = computed(() => {
  return (id: string) => {
    return useCmdBarState?.state.selectedCommandId === id
  }
})

const scrollSelectedIntoView = () => {
  const item = getSelectedItem()
  item?.scrollIntoView({ block: 'nearest' })
}

const getSelectedItem = () => {
  const selectedId = useCmdBarState?.state.selectedCommandId
  return containerRef.value?.querySelector(`[data-id="${selectedId}"]`) as HTMLElement
}

/**
 * handle scroll into view
 */
watch(
  () => useCmdBarState?.state.selectedCommandId,
  (newVal) => {
    if (newVal) {
      nextTick(scrollSelectedIntoView)
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="group-container" ref="containerRef">
    <ul data-cmd-bar-items class="items">
      <li
        v-for="(command, index) of group.commands"
        :key="`${group.key}-${index}`"
        class="item"
        :aria-selected="isSelectedItem(command.id)"
        @mousemove="useCmdBarState?.selectCommand(command.id)"
      >
        <slot :command="command" />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss"></style>
