<script setup lang="ts">
import type { Command, Group } from '@/types'
import { useCmdBarState } from '@/useCmdBarState'
import { computed } from 'vue'

const props = defineProps<{
  group: Group
}>()

defineSlots<{
  default?: (props: { command: Command }) => any
}>()

const emit = defineEmits<{
  execute: [command: Command]
}>()

const isSelectedItem = computed(() => {
  return (id: string) => {
    return useCmdBarState?.state.selectedCommandId === id
  }
})

function handleClick(clickedItem: Command) {
  emit('execute', clickedItem)
  useCmdBarState?.executeCommand()
}
</script>

<template>
  <div class="group-container">
    <ul data-cmd-bar-items class="items">
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
  </div>
</template>

<style scoped lang="scss"></style>
