<script setup lang="ts">
import type { Command, Group } from '../types'
import { useCmdBarState } from '../useCmdBarState'
import { computed } from 'vue'

const props = defineProps<{
  group: Group
}>()

defineSlots<{
  default(props: { command: Command }): any
  loading(props: { group: Group }): any
}>()

const emit = defineEmits<{
  execute: [command: Command]
}>()

const isSelectedItem = computed(() => {
  return (id: string) => {
    return useCmdBarState?.state.selectedCommandId === id
  }
})

const groupIsLoading = computed(() => {
  return useCmdBarState?.state.groupLoadingStates[props.group.key]
})

function handleClick(clickedItem: Command) {
  emit('execute', clickedItem)
  useCmdBarState?.executeCommand()
}
</script>

<template>
  <div class="group-container">
    <ul v-if="!groupIsLoading" data-cmd-bar-items class="items">
      <li
        v-for="(command, index) of group.commands"
        :key="`${group.key}-${index}`"
        :data-id="command.id"
        role="option"
        class="item"
        :aria-selected="isSelectedItem(command.id)"
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
