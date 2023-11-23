<script setup lang="ts">
import { useCmdBarEvent } from '../useCmdBarEvent'
import type { Command, Group } from '../types'
import { useCmdBarState } from '../useCmdBarState'
import { computed } from 'vue'

const props = defineProps<{
  group: Group
}>()

const { emitter } = useCmdBarEvent()

const emit = defineEmits<{
  selected: [command: Command]
  clicked: [command: Command]
}>()

const isSelectedItem = computed(() => {
  return (command: Command) => {
    const isSelected = useCmdBarState?.state.selectedCommandId === command.id
    if (isSelected) {
      emitter.emit('selected', command as Command)
      return true
    }
    return false
  }
})

const groupIsLoading = computed(() => {
  return useCmdBarState?.state.groupLoadingStates[props.group.key]
})

function handleClick(clickedCommand: Command) {
  emitter.emit('clicked', clickedCommand as Command)
  useCmdBarState?.executeCommand()
}
</script>

<template>
  <div class="group-container">
    <ul v-if="!groupIsLoading && group.commands" data-cmd-bar-items class="items">
      <li
        v-for="(command, index) of group.commands"
        :key="`${group.key}-${index}`"
        :data-id="command.id"
        role="option"
        class="item"
        :aria-selected="isSelectedItem(command)"
        @mousemove="useCmdBarState?.selectCommand(command.id)"
        @click="handleClick(command)"
      >
        <slot :command="command" />
      </li>
    </ul>
    <div v-else class="loading">
      <slot name="loading" :group="group" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
