<script setup lang="ts">
import CmdBarGroup from '@/components/CmdBarGroup.vue'
import type { Group } from '@/types'
import { useCmdBarState } from '@/useCmdBarState'
import { useVirtualList } from '@vueuse/core'
import { computed, type ComputedRef, nextTick, ref, watch, watchEffect } from 'vue'

const props = defineProps<{
  config: {
    itemHeightInPixel: number
    containerHeight: string
    groupLabelHeightInPixel?: number
  }
}>()

const labelRef = ref<HTMLElement[] | null>(null) // Create a ref for the label element

const groupedCommands = computed(() => {
  return useCmdBarState.state.filteredGroupedCommands as Group[]
})

/* flatten grouped commands, to use with virtual list */
const visibleItems = computed(() => {
  return useCmdBarState.state.filteredGroupedCommands.flatMap((group) => {
    return [group.label, group.commands]
  })
})

const { containerProps, wrapperProps } = useVirtualList(visibleItems as ComputedRef, {
  itemHeight: (index: number) => {
    // handle dynamic height for label
    if (typeof visibleItems.value[index] === 'string') {
      return props.config.groupLabelHeightInPixel ?? 0
    }
    return props.config.itemHeightInPixel
  }
})

/* set fixed height for container */
watchEffect(() => {
  containerProps.style = {
    height: props.config.containerHeight
  }
})

/* set fixed height for label */
watchEffect(() => {
  labelRef.value?.forEach((label) => {
    label.style.height = `${props.config.groupLabelHeightInPixel}px`
  })
})

/* handle scroll to selected item */
const getSelectedItem = () => {
  const selectedId = useCmdBarState?.state.selectedCommandId
  return containerProps.ref.value?.querySelector(`[data-id="${selectedId}"]`) as HTMLElement
}

const scrollSelectedIntoView = () => {
  const item = getSelectedItem()
  item?.scrollIntoView({ block: 'nearest' })
}

watch(
  () => useCmdBarState?.state.selectedCommandId,
  (newVal) => {
    if (newVal) {
      nextTick(scrollSelectedIntoView)
    }
  }
)
</script>

<template>
  <div class="grouped-list" v-bind="containerProps">
    <ul data-cmd-bar-items class="list-items" v-bind="wrapperProps">
      <li v-for="group in groupedCommands" :key="group.key" class="group">
        <h2 v-if="group.label && group.commands.length > 0" class="group__label" ref="labelRef">
          {{ group.label }}
        </h2>
        <CmdBarGroup :group="group">
          <template v-for="(_, name) in $slots" :key="group.key" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </CmdBarGroup>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss"></style>
