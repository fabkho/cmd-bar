<script setup lang="ts">
import type { PropType } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'

const props = defineProps({
  groups: {
    type: Array as PropType<Array<string>>,
    required: true
  },
  defaultGroup: {
    type: String as PropType<string>,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'filterChange', groups: Array<string>): void
}>()

const selectedGroups = useCmdBarState?.state.selectedGroups
const groupSet = new Set(props.groups)

function isSelected(group: string) {
  if (group === props.defaultGroup && selectedGroups.size === 0) {
    return true
  } else {
    return selectedGroups.has(group)
  }
}

function toggleGroup(group: string) {
  const filterChips = document.querySelectorAll('.filter-chip')
  const defaultChip = document.querySelector(`.filter-chip[data-id="${props.defaultGroup}"]`)

  if (group !== props.defaultGroup) {
    useCmdBarState?.toggleGroup(group)
    emit('filterChange', Array.from(selectedGroups))

    // remove selected class from default group
    if (selectedGroups.size > 1) {
      defaultChip?.classList.remove('filter-chip--selected')
    }
  } else {
    // remove selected class from all groups
    filterChips.forEach((chip) => {
      chip.classList.remove('filter-chip--selected')
    })
    // add selected class to default "All" group
    const defaultChip = document.querySelector(`.filter-chip[data-id="${props.defaultGroup}"]`)
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
