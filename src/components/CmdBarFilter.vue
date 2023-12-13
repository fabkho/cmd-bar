<script setup lang="ts">
import { Group } from '@/Users/fabiankirchhoff/code/cmd-bar'
import { useKeymap } from '../useKeymap'
import { type PropType, onMounted, nextTick, ref, watchEffect } from 'vue'
import { useCmdBarState } from '../useCmdBarState'

const props = defineProps({
  defaultFilterOption: {
    type: String as PropType<Lowercase<string> | null>,
    default: null
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
  default(props: { group: Group; isSelected: boolean }): any
}>()

const selectedGroups = useCmdBarState?.state.selectedGroups
const groups = useCmdBarState?.state.groupedCommands.map((group) => group.key)
const groupSet = new Set(
  props.defaultFilterOption ? [props.defaultFilterOption, ...groups] : groups
)

const lineStyle = ref({
  transform: 'translateX(0)',
  width: '0'
})

// add space as shortcut to select currently focused group
useKeymap(() => [
  {
    key: 'Space',
    action: () => {
      const focusedElement = document.activeElement as HTMLElement
      if (focusedElement && focusedElement.classList.contains('filter-chip')) {
        const group = focusedElement.dataset.id
        if (group !== undefined) {
          toggleGroup(group)
        }
      }
    },
    autoRepeat: false
  }
])

function isSelected(group: string): boolean {
  if (group === props.defaultFilterOption && selectedGroups.size === 0) {
    return true
  } else {
    return selectedGroups.has(group)
  }
}

function toggleGroup(group: string) {
  if (group !== props.defaultFilterOption) {
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
  toggleGroup(props?.defaultFilterOption as string)
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
        v-for="group in groupSet"
        :key="group"
        :data-id="group"
        class="filter-chip"
        :aria-selected="isSelected(group)"
        role="tab"
        tabindex="0"
        @keydown.enter.prevent
        @click="toggleGroup(group)"
      >
        <slot :group="group" :is-selected="isSelected(group)">
          {{ group }}
        </slot>
      </button>
    </div>
    <!-- Bottom line -->
    <div :style="lineStyle" class="filter-line" />
  </div>
</template>

<style scoped lang="scss"></style>
