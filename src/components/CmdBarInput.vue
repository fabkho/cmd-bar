<script setup lang="ts">
import { requireInjection } from '@/utils'
import type { CmdBarStore } from '@/types'
import { USE_CMD_STATE } from '@/useCmdState'

defineProps({
  placeholder: {
    type: String,
    default: 'search for anything'
  }
})

const emit = defineEmits<{
  (e: 'input', val: any): void
}>()

const useCmdState = requireInjection<CmdBarStore>(USE_CMD_STATE)
const modelValue = useCmdState?.state.searchTerm ?? ''
/**
 * handle input event
 * emit input event and store value in store
 */
function handleInput(e: Event): void {
  const target = e.target as HTMLInputElement
  const value = target.value
  emit('input', value)
  useCmdState.setSearchTerm(value)
}
</script>

<template>
  <input
    data-cmd-bar-input
    class="cmd-bar__input"
    autofocus
    :value="modelValue"
    :placeholder="placeholder"
    @input="handleInput"
  />
</template>
