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
  fuse: {
    type: Object as PropType<UseFuseOptions<Group>>,
    default: () => ({})
  }
})

const emit = defineEmits<{
  input: [ie: InputEvent]
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
  useCmdBarState?.updateQuery((e.target as HTMLInputElement)?.value, options)
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
