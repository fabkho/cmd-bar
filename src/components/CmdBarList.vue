<script setup lang="ts">
import { useCmdBarState } from '@/useCmdBarState'
import { computed, watch, ref, nextTick } from 'vue'
import CmdBarGroup from '@/components/CmdBarGroup.vue'
import type { Group } from '@/types'

const props = defineProps<{
  itemHeightInPixel: number
  containerHeight: string
}>()

const containerRef = ref<HTMLElement | null>(null)

const groupedCommands = computed(() => {
  return useCmdBarState.state.filteredGroupedCommands as Group[]
})

// const visibleItems = computed(() => {
//   return useCmdBarState?.state.commands
// })
//
// const { list, containerProps, wrapperProps } = useVirtualList(visibleItems as ComputedRef, {
//   itemHeight: props.itemHeightInPixel
// })

// set fixed height for container
watch(
  () => props.containerHeight,
  () => {
    nextTick(() => {
      if (containerRef.value) {
        containerRef.value.style.height = props.containerHeight
      }
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="grouped-list" ref="containerRef">
    <ul data-cmd-bar-items class="list-items">
      <li v-for="group in groupedCommands" :key="group.key" class="group">
        <h2 v-if="group.label && group.commands.length > 0" class="group__label">
          {{ group.label }}
        </h2>
        <CmdBarGroup :group="group">
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </CmdBarGroup>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss"></style>
