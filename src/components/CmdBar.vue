<script setup lang="ts">
import type { Group } from '../types'
import type { PropType } from 'vue'
import { useCmdBarState } from '../useCmdBarState'
import { watch } from 'vue'

const props = defineProps({
  commands: {
    type: Array as PropType<Group[]>,
    required: true
  },
  loop: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

watch(
  () => props.commands,
  () => {
    useCmdBarState?.registerState(props.commands)
  },
  { deep: true, immediate: true }
)

function handleKeyDown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowUp':
      useCmdBarState?.nextCommand(props.loop)
      break
    case 'ArrowDown':
      useCmdBarState?.prevCommand(props.loop)
      break
    case 'ArrowLeft':
      // Insert your custom logic here
      break
    case 'ArrowRight':
      // Insert your custom logic here
      break
    case 'Enter':
      useCmdBarState?.executeCommand()
      break
    default:
      // Insert your custom logic here
      break
  }
}
</script>

<template>
  <div @keydown="handleKeyDown">
    <slot />
  </div>
</template>

<style scoped lang="scss"></style>
