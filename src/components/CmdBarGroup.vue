<script setup lang="ts">
import type { Command, Group } from '@/types'
import { useCmdBarState } from '@/useCmdBarState'
import { nextTick, ref, watch, computed } from 'vue'

const props = defineProps<{
  group: Group
}>()

defineSlots<{
  default?: (props: { command: Command }) => any
}>()

const emit = defineEmits<{
  execute: [command: Command]
}>()

const containerRef = ref<HTMLDivElement | null>(null)

const isSelectedItem = computed(() => {
  return (id: string) => {
    return useCmdBarState?.state.selectedCommandId === id
  }
})

const scrollSelectedIntoView = () => {
  const item = getSelectedItem()
  item?.scrollIntoView({ block: 'nearest' })
}

const getSelectedItem = () => {
  const selectedId = useCmdBarState?.state.selectedCommandId
  return containerRef.value?.querySelector(`[data-id="${selectedId}"]`) as HTMLElement
}

function handleClick(clickedItem: Command) {
  emit('execute', clickedItem)
  useCmdBarState?.executeCommand()
}

/**
 * handle scroll into view
 */
watch(
  () => useCmdBarState?.state.selectedCommandId,
  (newVal) => {
    if (newVal) {
      nextTick(scrollSelectedIntoView)
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="group-container" ref="containerRef">
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
