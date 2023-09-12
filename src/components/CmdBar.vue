<script setup lang="ts">
import type { Group } from '@/types'
import type { PropType } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'

const props = defineProps({
  commands: {
    type: Array as PropType<Group[]>,
    required: true
  }
})

useCmdBarState?.registerGroups(props.commands)

//TODO:
// - provide store
// - handle async commands
</script>

<template>
  <slot />
</template>

<style scoped lang="scss"></style>
