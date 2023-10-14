<script setup lang="ts">
import { useKeymap } from '../useKeymap'
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

useKeymap({
  ArrowUp: {
    action: () => useCmdBarState?.nextCommand(props.loop)
  },
  ArrowDown: {
    action: () => useCmdBarState?.prevCommand(props.loop)
  },
  Enter: {
    action: () => useCmdBarState?.executeCommand()
  }
}).addKeyBindingsFromCommands(props.commands)

watch(
  () => props.commands,
  () => {
    useCmdBarState?.initState(props.commands)
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div>
    <slot />
  </div>
</template>

<style scoped lang="scss"></style>
