<script setup lang="ts">
import { computed, nextTick, ref, unref, watch, watchEffect } from 'vue'
import store from '@/useCmdBarState'
import { useVirtualList } from '@vueuse/core'

const props = defineProps<{
  itemHeight: number
}>()

const containerRef = ref<HTMLDivElement>()
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

watch(
  () => store?.state.selectedCommandId,
  (id) => {
    if (id) {
      const containerRef = containerProps.ref
      if (containerRef) {
        const container = unref(containerRef)
        if (!container) return

        const item = container.querySelector(`[aria-selected="true"]`)
        if (!item) return

        const itemRect = item.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        console.log(itemRect.bottom, containerRect.bottom)

        if (itemRect.bottom > containerRect.bottom) {
          // Selected item is below the visible area
          const scrollToY = container.scrollTop + itemRect.height
          scrollTo(scrollToY)
        } else if (itemRect.top < containerRect.top) {
          // Selected item is above the visible area
          const scrollToY = container.scrollTop - itemRect.height
          scrollTo(scrollToY)
        }
      }
    }
  }
)
</script>

<template>
  <div class="cmd-bar__items-container" v-bind="containerProps">
    <ul data-cmd-bar-items class="cmd-bar__items" v-bind="wrapperProps">
      <li
        data-cmd-bar-item
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
