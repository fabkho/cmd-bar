<script setup lang="ts">
import type { Commands, Group } from '@/types'
import type { PropType } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'

const props = defineProps({
  commands: {
    type: Array as PropType<Commands | null>,
    required: false,
    default: null
  },
  groupedCommands: {
    type: Array as PropType<Group[] | null>,
    required: false,
    default: null
  }
})

if (props.commands) {
  useCmdBarState?.registerCommands(props.commands, false)
} else if (props.groupedCommands) {
  useCmdBarState?.registerGroups(props.groupedCommands)
}

//TODO:
// - provide store
// - handle async commands
</script>

<template>
  <slot />
</template>

<style scoped lang="scss"></style>
