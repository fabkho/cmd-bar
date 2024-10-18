<script setup lang="ts">
import type { Group } from '../types'
import { useCmdBarState } from '../composables/useCmdBarState'
import { watch } from 'vue'

const { commands } = defineProps<{
  commands: Group[]
}>()

const { initState } = useCmdBarState()

watch(
  () => commands,
  () => {
    initState(commands)
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <slot />
</template>

<style scoped lang="scss"></style>
