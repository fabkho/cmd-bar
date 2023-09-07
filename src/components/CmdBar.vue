<script setup lang="ts">
import type { Commands } from '@/types'
import type { PropType } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'

const props = defineProps({
  commands: {
    type: Array as PropType<Commands>,
    required: true
  }
  // loadAsyncCommands: {
  //   type: () => Promise<Commands[]>,
  //   default: null
  // },
  // transformer: {
  //   type: () => (commands: Commands) => commands,
  //   default: (commands: Commands) => commands
  // }
})

useCmdBarState?.registerCommands(props.commands)

//TODO:
// - provide store
// - handle async commands
</script>

<template>
  <slot />
</template>

<style scoped lang="scss"></style>
