<script setup lang="ts">
import { useCmdBarState } from '@/useCmdBarState'
import { computed } from 'vue'

defineProps({
  placeholder: {
    type: String,
    default: 'search for anything'
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'input', ie: InputEvent): void
  (e: 'update:modelValue', val: any): void
}>()

const localSearchTerm = computed(() => useCmdBarState?.state.searchTerm)

/**
 * handle input event
 * emit input event and store value in store
 */
function handleInput(e: Event): void {
  const event = e as InputEvent
  const input = e.target as HTMLInputElement
  useCmdBarState?.setSearchTerm(input?.value)
  emit('input', event)
  emit('update:modelValue', input?.value)
}
</script>

<template>
  <input
    data-cmd-bar-input
    class="input"
    autofocus
    :value="localSearchTerm"
    :placeholder="placeholder"
    @input="handleInput"
  />
</template>
