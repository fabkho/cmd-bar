<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import store from '@/useCmdBarState'
import { useVirtualList } from '@vueuse/core'

const props = defineProps<{
  itemHeight: number
}>()

const index = ref<number>(0)

const isSelectedItem = computed(() => {
  return (id: string) => {
    return store?.state.selectedCommandId === id
  }
})

const visibleItems = computed(() => {
  return store?.state.visibleCommands
})

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(visibleItems, {
  itemHeight: props.itemHeight
})

const scrollSelectedIntoView = () => {
  const item = getSelectedItem()

  console.log('item', item)

  if (item) {
    // Ensure the item is always in view
    item.scrollIntoView({ block: 'nearest' })
  }
}

const getSelectedItem = () => {
  const containerRef = containerProps.ref
  const selectedId = store?.state.selectedCommandId
  console.log('selectedId', `[data-id="${selectedId}"]`)
  return containerRef.value?.querySelector(`[data-id="${selectedId}"]`) as HTMLElement
}

/**
 * handle scroll into view
 */
watch(
  () => store?.state.selectedCommandId,
  (newVal) => {
    if (newVal) {
      nextTick(scrollSelectedIntoView)
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="cmd-bar__items-container" v-bind="containerProps">
    <ul data-cmd-bar-items class="cmd-bar__items" v-bind="wrapperProps">
      <li
        data-cmd-bar-item
        :data-id="item.data.id"
        v-for="item in list"
        class="cmd-bar__items__item"
        role="option"
        :aria-selected="isSelectedItem(item.data.id)"
        @mouseover="store?.selectCommand(item.data.id)"
        @click="store?.executeCommand()"
      >
        <slot :item="item.data" />
      </li>
    </ul>
  </div>
</template>
