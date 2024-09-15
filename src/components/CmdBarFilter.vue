<script setup lang="ts">
import { FilterOption } from '../types'
import { type PropType, onMounted, nextTick, ref, watchEffect } from 'vue'
import { useCmdBarState } from '../composables/useCmdBarState'

const props = defineProps({
  filterOptions: {
    type: Array as PropType<FilterOption[]>, // Use the created interface here
    default: () => []
  },
  asCheckbox: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const emit = defineEmits<{
  filterChange: [groups: Array<string>]
}>()

defineSlots<{
  default(props: { group: FilterOption; isSelected: boolean }): any
  option(props: { hiddenOptions: FilterOption[] }): any
}>()

const selectedGroups = useCmdBarState?.state.selectedGroups

const lineStyle = ref({
  transform: 'translateX(0)',
  width: '0'
})

const groupSet = ref(new Set<FilterOption>()) // Use Set<FilterOption> here
const hiddenOptions = ref<FilterOption[]>([])
const defaultFilterOption = ref()

function initGroups() {
  props.filterOptions.forEach((option) => {
    if (option.groupKey === 'default') {
      defaultFilterOption.value = option.groupKey
    }
    if (!option.visible) {
      hiddenOptions.value.push(option)
      return
    }
    groupSet.value.add(option)
  })
}

function isSelected(group: string): boolean {
  if (group === defaultFilterOption.value && selectedGroups.size === 0) {
    return true
  } else {
    return selectedGroups.has(group)
  }
}

function toggleGroup(group: string) {
  if (group !== defaultFilterOption.value) {
    useCmdBarState?.toggleGroup(group, props.asCheckbox)
    emit('filterChange', Array.from(selectedGroups))

    if (selectedGroups.size === 0) {
      useCmdBarState?.resetFilter()
    }
    setLineStyle()
  } else {
    useCmdBarState?.toggleGroup(group, props.asCheckbox)
    setLineStyle()
    useCmdBarState?.resetFilter()
  }
}

onMounted(() => {
  toggleGroup(defaultFilterOption.value as string)
  initGroups()
})

// this is needed to update the line position when the cmd bar is opened
watchEffect(() => {
  // check if we are in browser for SSR
  const isBrowser = typeof window !== 'undefined'
  if (!isBrowser) return null

  const resizeObserver = new ResizeObserver(() => {
    setLineStyle()
  })
  nextTick(() => {
    const filter = document.querySelector('.filter')
    if (filter) {
      resizeObserver.observe(filter)
    }
  })
})

/**
 * Update line position and size
 */
async function setLineStyle() {
  /**
   * Wait until next tick to make sure that refs are set
   */
  await nextTick(() => {
    // get aria-selected element
    const tabElement = document.querySelector('.filter-chip[aria-selected="true"]') as HTMLElement
    if (!tabElement) return
    const width = tabElement.clientWidth
    const offsetLeft = tabElement.offsetLeft
    lineStyle.value = {
      transform: `translateX(${offsetLeft}px)`,
      width: width + 'px'
    }
  })
}
</script>

<template>
  <div class="filter">
    <div class="filter-list" role="tablist">
      <button
        v-for="group in Array.from(groupSet)"
        :key="group.groupKey"
        :data-id="group.groupKey"
        class="filter-chip"
        :aria-selected="isSelected(group.groupKey)"
        role="tab"
        tabindex="0"
        @keydown.enter.prevent
        @click="toggleGroup(group.groupKey)"
      >
        <slot :group="group" :is-selected="isSelected(group.groupKey)">
          {{ group.label }}
          <!-- Access label property from FilterOption -->
        </slot>
      </button>
      <slot name="option" :hidden-options="hiddenOptions" />
    </div>
    <!-- Bottom line -->
    <div :style="lineStyle" class="filter-line" />
  </div>
</template>

<style scoped lang="scss"></style>
