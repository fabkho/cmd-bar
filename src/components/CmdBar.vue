<script setup lang="ts">
import type { Group } from '../types'
import { useCmdBarState } from '../composables/useCmdBarState'
import { watch } from 'vue'

const { commands } = defineProps<{
  commands: Group[]
}>()

watch(
  () => commands,
  () => {
    useCmdBarState?.initState(commands)
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <slot />
</template>

<style scoped lang="scss"></style>
