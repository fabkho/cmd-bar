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

const query = computed(() => useCmdBarState?.state.query)

/**
 * handle input event
 * emit input event and store value in store
 */
function handleInput(e: Event): void {
  console.log('handleInput')
  const event = e as InputEvent
  const input = e.target as HTMLInputElement

  useCmdBarState?.updateQuery(input?.value, false)

  emit('input', event)
  emit('update:modelValue', input?.value)
}

function clearQuery(): void {
  useCmdBarState?.updateQuery('', !props.modelValue)
}
</script>

<template>
  <div class="input-container">
    <span class="input__leading" aria-hidden="true">
      <slot name="leading" />
    </span>
    <input
      data-cmd-bar-input
      class="input"
      autofocus
      autocomplete="off"
      aria-autocomplete="list"
      role="combobox"
      :value="query"
      :placeholder="placeholder"
      :aria-label="placeholder"
      @input="handleInput"
    />
    <div class="input__clear">
      <button @click="clearQuery" aria-label="Close">
        <slot name="clear" />
      </button>
    </div>
  </div>
</template>
