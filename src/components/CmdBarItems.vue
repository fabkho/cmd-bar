<script setup lang="ts">
import { useCmdBarEvent } from '../composables/useCmdBarEvent'
import type { Command } from '../types'
import { useCmdBarState } from '../composables/useCmdBarState'
import { computed } from 'vue'

defineProps<{
  commands: Readonly<Command[]>
}>()

const { emitter } = useCmdBarEvent()

const isSelectedItem = (command: Command): boolean => {
  return useCmdBarState.state.selectedCommandId === command.id
}
function handleClick(clickedCommand: Command) {
  emitter.emit('clicked', clickedCommand as Command)
  useCmdBarState?.executeCommand()
}
</script>

<template>
  <li
    v-for="(command, index) of commands"
    :key="`${command.id}-${index}`"
    :data-id="command.id"
    role="option"
    class="item"
    :aria-selected="isSelectedItem(command)"
    @mousemove="useCmdBarState?.selectCommand(command.id)"
    @click="handleClick(command)"
  >
    <slot :command="command" />
  </li>
</template>

<style scoped lang="scss"></style>
