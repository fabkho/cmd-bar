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
  }
})

useKeymap((nav) => [
  {
    key: 'ArrowUp',
    action: () => nav.next(),
    autoRepeat: true
  },
  {
    key: 'ArrowDown',
    action: () => nav.prev(),
    autoRepeat: true
  },
  {
    key: 'Enter',
    action: () => nav.execute(),
    autoRepeat: true
  }
]).addKeyBindingsFromCommands(props.commands)

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
