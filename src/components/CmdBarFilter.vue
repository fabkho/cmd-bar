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

// preselect the default
if (props.defaultGroup) {
  useCmdBarState?.toggleGroup(props.defaultGroup)
  emit('filterChange', Array.from(useCmdBarState?.state.selectedGroups))
}

function isSelected(group: string) {
  // return useCmdBarState.state.selectedGroups.has(group)
  if (group === props.defaultGroup && useCmdBarState.state.selectedGroups.size === 1) {
    return true
  } else {
    return useCmdBarState.state.selectedGroups.has(group)
  }
}

function toggleGroup(group: string) {
  const filterChips = document.querySelectorAll('.filter-chip')
  const defaultChips = document.querySelector(`.filter-chip[data-id="${props.defaultGroup}"]`)

  if (group !== props.defaultGroup) {
    useCmdBarState?.toggleGroup(group)
    emit('filterChange', Array.from(useCmdBarState?.state.selectedGroups))

    // remove selected class from default group
    defaultChips?.classList.remove('filter-chip--selected')
  } else {
    // remove selected class from all groups
    filterChips.forEach((chip) => {
      chip.classList.remove('filter-chip--selected')
    })
    // add selected class to default "All" group
    const defaultChips = document.querySelector(`.filter-chip[data-id="${props.defaultGroup}"]`)
    defaultChips?.classList.add('filter-chip--selected')
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
