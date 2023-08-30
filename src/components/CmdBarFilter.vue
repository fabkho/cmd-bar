<script setup lang="ts">
import type { PropType } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'

const props = defineProps({
  groups: {
    type: Array as PropType<Array<string>>,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'filterChange', groups: Array<string>): void
}>()

const selectedGroups = useCmdBarState?.state.selectedGroups
const groupSet = new Set(props.groups)

function isSelected(group: string) {
  return useCmdBarState?.state.selectedGroups.has(group)
}

function toggleGroup(group: string) {
  useCmdBarState?.toggleGroup(group)
  emit('filterChange', Array.from(useCmdBarState?.state.selectedGroups))
}
</script>

<template>
  <div class="filter">
    <div
      data-cmd-bar-filter-chip
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
