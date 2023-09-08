<script setup lang="ts">
import type { Commands } from '@/types'
import type { PropType } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'

const props = defineProps({
  commands: {
    type: Array as PropType<Commands>,
    required: true
  },
  asyncCommands: {
    type: Array as PropType<Commands>,
    default: () => []
  }
})

useCmdBarState?.registerCommands(props.commands, false)

//TODO:
// - provide store
// - handle async commands
</script>

<template>
  <slot />
</template>

<style scoped lang="scss"></style>
