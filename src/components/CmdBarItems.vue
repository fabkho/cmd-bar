<script setup lang="ts">
import { useCmdBarEvent } from '../composables/useCmdBarEvent'
import type { Command } from '../types'
import { useCmdBarState } from '../composables/useCmdBarState'
import { computed } from 'vue'

defineProps<{
  commands: Readonly<Command[]>
}>()

const { emitter } = useCmdBarEvent()
const { state, selectCommand, executeCommand } = useCmdBarState()

const isSelectedItem = (command: Command): boolean => {
  return state.selectedCommandKey === command.key
}
function handleClick(clickedCommand: Command) {
  emitter.emit('clicked', clickedCommand as Command)
  executeCommand()
}
</script>

<template>
  <li
    v-for="(command, index) of commands"
    :key="`${command.key}-${index}`"
    :data-id="command.key"
    role="option"
    class="item"
    :aria-selected="isSelectedItem(command)"
    @mousemove="selectCommand(command.key)"
    @click="handleClick(command)"
  >
    <slot :command="command" />
  </li>
</template>

<style scoped lang="scss"></style>
