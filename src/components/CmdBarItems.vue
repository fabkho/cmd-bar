<script setup lang="ts">
import { useCmdBarEvent } from '../composables/useCmdBarEvent'
import type { Command } from '../types'
import { useCmdBarState } from '../composables/useCmdBarState'
import { computed } from 'vue'

defineProps<{
  commands: Readonly<Command[]>
}>()

const { state, selectCommand, executeCommand } = useCmdBarState()

const isSelectedItem = (command: Command): boolean => {
  return state.selectedCommandKey === command.key
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
    @mouseenter="selectCommand(command.key)"
    @click="executeCommand()"
  >
    <slot :command="command" />
  </li>
</template>

<style scoped lang="scss"></style>
