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

  useCmdBarState?.updateQuery(input?.value, !props.modelValue)

  emit('input', event)
  emit('update:modelValue', input?.value)
}

function clearQuery(): void {
  useCmdBarState?.updateQuery('', !props.modelValue)
}
</script>

<template>
  <div class="input-container">
    <label class="input__leading" for="input">
      <slot name="leading" />
    </label>
    <input
      data-cmd-bar-input
      class="input"
      autofocus
      aria-autocomplete="list"
      role="combobox"
      :aria-expanded="true"
      :value="query"
      :placeholder="placeholder"
      @input="handleInput"
    />
    <div class="input__clear">
      <button @click="clearQuery">
        <slot name="clear" />
      </button>
    </div>
  </div>
</template>
