<script setup lang="ts">
import { useCmdBarState } from '../useCmdBarState'
import type { Group } from '../types'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import { computed, PropType, ComputedRef } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search'
  },
  modelValue: {
    type: String,
    default: ''
  },
  fuse: {
    type: Object as PropType<UseFuseOptions<Group>>,
    default: () => ({})
  }
})

const emit = defineEmits<{
  input: [ie: InputEvent]
  'update:modelValue': [val: string]
}>()

const query = computed(() => useCmdBarState?.state.query)

const options: ComputedRef<Partial<UseFuseOptions<Group>>> = computed(() => {
  return {
    fuseOptions: {
      ...props.fuse?.fuseOptions,
      keys: props.fuse?.fuseOptions?.keys ?? ['commands.label'],
      includeMatches: true
    },
    resultLimit: 12,
    matchAllWhenSearchEmpty: true
  }
})

/**
 * handle input event
 * emit input event and store value in store
 */
function handleInput(e: Event): void {
  const event = e as InputEvent
  const input = e.target as HTMLInputElement

  useCmdBarState?.updateQuery(input?.value, options)

  emit('input', event)
  emit('update:modelValue', input?.value)
}

function clearQuery(): void {
  useCmdBarState?.clearQuery()
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
      <button aria-label="Close" @click="clearQuery" tabindex="-1">
        <slot name="clear" />
      </button>
    </div>
  </div>
</template>
