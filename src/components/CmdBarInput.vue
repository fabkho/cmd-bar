<script setup lang="ts">
import { useCmdBarState } from '@/useCmdBarState'
import { computed } from 'vue'

const props = defineProps<{
  placeholder: string
  modelValue?: string
}>()

const emit = defineEmits<{
  input: [ie: InputEvent]
  'update:modelValue': [val: any]
}>()

const localSearchTerm = computed(() => useCmdBarState?.state.searchTerm)

/**
 * handle input event
 * emit input event and store value in store
 */
function handleInput(e: Event): void {
  const event = e as InputEvent
  const input = e.target as HTMLInputElement

  useCmdBarState?.setSearchTerm(input?.value, !!props.modelValue)

  emit('input', event)
  emit('update:modelValue', input?.value)
}
</script>

<template>
  <input
    data-cmd-bar-input
    class="input"
    autofocus
    aria-autocomplete="list"
    role="combobox"
    :aria-expanded="true"
    :value="localSearchTerm"
    :placeholder="placeholder"
    @input="handleInput"
  />
</template>
