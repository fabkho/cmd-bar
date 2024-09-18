<script setup lang="ts">
import { useCmdBarState } from '../composables/useCmdBarState'
import type { Command } from '../types'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import { computed, PropType, ComputedRef } from 'vue'

const {
  placeholder = 'Search',
  fuse = {},
  nonTriggerKeys = ['@', '/']
} = defineProps<{
  placeholder: string
  fuse: UseFuseOptions<Command>
  nonTriggerKeys: string[]
}>()

const emit = defineEmits<{
  input: [query: string]
}>()

defineSlots<{
  leading(): any
  clear(): any
}>()

const query = computed(() => useCmdBarState?.state.query)

const options: ComputedRef<Partial<UseFuseOptions<Command>>> = computed(() => {
  return {
    fuseOptions: {
      ...fuse?.fuseOptions,
      keys: fuse?.fuseOptions?.keys ?? ['label'],
      minMatchCharLength: fuse?.fuseOptions?.minMatchCharLength ?? 2
    },
    resultLimit: fuse?.resultLimit ?? 12
  }
})

/**
 * handle input event
 * emit input event and store value in store
 */
function handleInput(e: Event): void {
  const inputValue = (e.target as HTMLInputElement)?.value

  if (nonTriggerKeys?.includes(inputValue)) {
    emit('input', inputValue)
    return
  }
  if (inputValue !== null && inputValue !== undefined) {
    useCmdBarState?.updateQuery(inputValue, options.value)
  }

  emit('input', inputValue)
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
      <button aria-label="Close" tabindex="-1" @click="clearQuery">
        <slot name="clear" />
      </button>
    </div>
  </div>
</template>
