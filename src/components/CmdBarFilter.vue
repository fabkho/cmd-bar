<script setup lang="ts">
import { useKeymap } from '../useKeymap'
import type { PropType } from 'vue'
import { useCmdBarState } from '../useCmdBarState'

const props = defineProps({
  defaultFilterOption: {
    type: String as PropType<Lowercase<string> | null>,
    default: null
  },
  autoFilter: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  asCheckbox: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const emit = defineEmits<{
  filterChange: [groups: Array<string>]
}>()

const selectedGroups = useCmdBarState?.state.selectedGroups
const groups = useCmdBarState?.state.groupedCommands.map((group) => group.key)
const groupSet = new Set(
  props.defaultFilterOption ? [props.defaultFilterOption, ...groups] : groups
)

// add space as shortcut to select currently focused group
useKeymap().handleKeyBinding('Space', () => {
  const focusedElement = document.activeElement as HTMLElement
  if (focusedElement && focusedElement.classList.contains('filter-chip')) {
    const group = focusedElement.dataset.id
    if (group !== undefined) {
      toggleGroup(group)
    }
  }
})

function isSelected(group: string) {
  if (group === props.defaultFilterOption && selectedGroups.size === 0) {
    return true
  } else {
    return selectedGroups.has(group)
  }
}

function toggleGroup(group: string) {
  const filterChips = document.querySelectorAll('.filter-chip')
  const defaultChip = document.querySelector(`.filter-chip[data-id="${props.defaultFilterOption}"]`)

  if (group !== props.defaultFilterOption) {
    useCmdBarState?.toggleGroup(group, props.asCheckbox, props.autoFilter)
    emit('filterChange', Array.from(selectedGroups))

    // remove selected class from default group
    if (selectedGroups.size > 0) {
      defaultChip?.classList.remove('filter-chip--selected')
    } else {
      useCmdBarState?.resetFilter()
    }
  } else {
    useCmdBarState?.toggleGroup(group, props.asCheckbox, props.autoFilter)
    // remove selected class from all groups
    filterChips.forEach((chip) => {
      chip.classList.remove('filter-chip--selected')
    })
    // add selected class to default "All" group
    const defaultChip = document.querySelector(
      `.filter-chip[data-id="${props.defaultFilterOption}"]`
    )
    defaultChip?.classList.add('filter-chip--selected')

    useCmdBarState?.resetFilter()
  }
}
</script>

<template>
  <div class="filter" role="tablist">
    <button
      v-for="group in groupSet"
      :key="group"
      :data-id="group"
      class="filter-chip"
      :aria-selected="isSelected(group)"
      role="tab"
      @click="toggleGroup(group)"
      tabindex="0"
    >
      {{ group }}
    </button>
  </div>
</template>

<style scoped lang="scss"></style>
