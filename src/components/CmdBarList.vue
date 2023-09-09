<script setup lang="ts">
import { computed, type ComputedRef, nextTick, ref, watch } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'
import { useVirtualList } from '@vueuse/core'
import type { Command } from '@/types'

const props = defineProps<{
  itemHeightInPixel: number
  containerHeight: string
}>()

defineSlots<{
  default?: (props: { item: Command }) => any
}>()

const emit = defineEmits<{
  execute: [command: Command]
}>()

const index = ref<number>(0)
const containerRef = ref<HTMLDivElement | null>(null)

const isSelectedItem = computed(() => {
  return (id: string) => {
    return useCmdBarState?.state.selectedCommandId === id
  }
})

const visibleItems = computed(() => {
  return useCmdBarState?.state.filteredCommands
})

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  visibleItems as ComputedRef,
  {
    itemHeight: props.itemHeightInPixel
  }
)
// set fixed height for container
watch(
  () => props.containerHeight,
  () => {
    containerProps.style = {
      height: props.containerHeight
    }
  },
  { immediate: true }
)

const scrollSelectedIntoView = () => {
  const item = getSelectedItem()
  item?.scrollIntoView({ block: 'nearest' })
}

const getSelectedItem = () => {
  const containerRef = containerProps.ref
  const selectedId = useCmdBarState?.state.selectedCommandId
  return containerRef.value?.querySelector(`[data-id="${selectedId}"]`) as HTMLElement
}

function handleClick(clickedItem: Command) {
  emit('execute', clickedItem)
  useCmdBarState?.executeCommand()
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
  <div class="list-container" v-bind="containerProps">
    <ul data-cmd-bar-items class="list-items" v-bind="wrapperProps">
      <li
        data-cmd-bar-item
        :data-id="item.data.id"
        v-for="item in list"
        class="list-item"
        role="option"
        :aria-selected="isSelectedItem(item.data.id)"
        @mousemove="useCmdBarState?.selectCommand(item.data.id)"
        @click="handleClick(item.data)"
      >
        <slot :item="item.data" />
      </li>
    </ul>
  </div>
</template>
