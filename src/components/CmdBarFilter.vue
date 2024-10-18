<script setup lang="ts">
import { FilterOption } from '../types'
import { onMounted, nextTick, ref, watchEffect, computed } from 'vue'
import { useCmdBarState } from '../composables/useCmdBarState'

const { filterOptions, asCheckbox = false } = defineProps<{
  filterOptions: FilterOption[]
  asCheckbox?: boolean
}>()

defineSlots<{
  default(props: { group: FilterOption; isSelected: boolean }): any
  option(props: { hiddenOptions: FilterOption[] }): any
}>()

const { lineStyle, setLineStyle } = useIndicator()

const { state, toggleGroup: toggleCmdBarGroup } = useCmdBarState()
const selectedGroups = computed(() => state.selectedGroups)

const groupSet = ref<Set<FilterOption>>(new Set<FilterOption>())
const hiddenOptions = ref<FilterOption[]>([])
const defaultFilterOption = ref<FilterOption | null>(null)

function initGroups() {
  filterOptions.forEach((option, index) => {
    if (!option.visible) {
      hiddenOptions.value.push(option)
      return
    }
    groupSet.value.add(option)
    // Set the first visible group as the default
    if (index === 0) {
      defaultFilterOption.value = option
    }
  })
}

initGroups()

// Select the first group if no group is selected
watchEffect(() => {
  if (defaultFilterOption.value && selectedGroups.value.size === 0) {
    toggleGroup(defaultFilterOption.value.groupKey)
  }
})

function isSelected(group: string | null): boolean {
  // Select the first group if no other group is selected
  if (!selectedGroups.value.size && defaultFilterOption.value?.groupKey === group) {
    return true
  }
  return selectedGroups.value.has(group)
}

function toggleGroup(group: string | null) {
  toggleCmdBarGroup(group, asCheckbox)

  setLineStyle()
}

function useIndicator() {
  const lineStyle = ref({
    transform: 'translateX(0)',
    width: '0'
  })

  async function setLineStyle() {
    await nextTick(() => {
      const tabElement = document.querySelector('.filter-chip[aria-selected="true"]') as HTMLElement
      if (!tabElement) return
      const width = tabElement.clientWidth
      const offsetLeft = tabElement.offsetLeft
      lineStyle.value = {
        transform: `translateX(${offsetLeft}px)`,
        width: `${width}px`
      }
    })
  }

  function observeResize() {
    const resizeObserver = new ResizeObserver(() => {
      setLineStyle()
    })
    nextTick(() => {
      const filter = document.querySelector('.filter')
      if (filter) {
        resizeObserver.observe(filter)
      }
    })
  }

  onMounted(() => {
    observeResize()
  })

  return { lineStyle, setLineStyle }
}
</script>

<template>
  <div class="filter">
    <div class="filter-list" role="tablist">
      <button
        v-for="group in Array.from(groupSet)"
        :key="group.groupKey ?? 'default'"
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
        </slot>
      </button>
      <slot name="option" :hidden-options="hiddenOptions" />
    </div>
    <!-- Bottom line -->
    <div :style="lineStyle" class="filter-line" />
  </div>
</template>
