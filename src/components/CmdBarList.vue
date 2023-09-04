<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'
import { useVirtualList } from '@vueuse/core'

const props = defineProps<{
  itemHeight: number
}>()

const index = ref<number>(0)

const isSelectedItem = computed(() => {
  return (id: string) => {
    return useCmdBarState?.state.selectedCommandId === id
  }
})

const visibleItems = computed(() => {
  return useCmdBarState?.state.filteredCommands
})

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(visibleItems, {
  itemHeight: props.itemHeight
})

const scrollSelectedIntoView = () => {
  const item = getSelectedItem()
  item?.scrollIntoView({ block: 'nearest' })
}

const getSelectedItem = () => {
  const containerRef = containerProps.ref
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
  <div class="list-container" v-bind="containerProps">
    <ul data-cmd-bar-items class="list" v-bind="wrapperProps">
      <li
        data-cmd-bar-item
        :data-id="item.data.id"
        v-for="item in list"
        class="list-item"
        role="option"
        :aria-selected="isSelectedItem(item.data.id)"
        @mousemove="useCmdBarState?.selectCommand(item.data.id)"
        @click="useCmdBarState?.executeCommand()"
      >
        <slot :item="item.data" />
      </li>
    </ul>
  </div>
</template>
