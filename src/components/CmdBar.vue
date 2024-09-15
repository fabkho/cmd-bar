<script setup lang="ts">
import type { Group } from '../types'
import { useCmdBarState } from '../composables/useCmdBarState'
import { watch } from 'vue'

const props = defineProps<{
  commands: Group[]
}>()

watch(
  () => props.commands,
  () => {
    useCmdBarState?.initState(props.commands)
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <slot />
</template>

<style scoped lang="scss"></style>
