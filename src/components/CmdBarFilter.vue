<script setup lang="ts">
import type { PropType } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'

const props = defineProps({
  filterOptions: {
    type: Array as PropType<Array<string>>,
    required: true
  },
  defaultFilterOption: {
    type: String as PropType<string | null>,
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
const groupSet = new Set(props.filterOptions)

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
      useCmdBarState?.resetGroups()
    }
  } else {
    // remove selected class from all groups
    filterChips.forEach((chip) => {
      chip.classList.remove('filter-chip--selected')
    })
    // add selected class to default "All" group
    const defaultChip = document.querySelector(
      `.filter-chip[data-id="${props.defaultFilterOption}"]`
    )
    defaultChip?.classList.add('filter-chip--selected')

    useCmdBarState?.resetGroups()
  }
}
</script>

<template>
  <div class="filter">
    <div
      :data-id="group"
      v-for="group in groupSet"
      :key="group"
      class="filter-chip"
      :class="{ 'filter-chip--selected': isSelected(group) }"
      @click="toggleGroup(group)"
    >
      {{ group }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
