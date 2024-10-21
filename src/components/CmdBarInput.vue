<script setup lang="ts">
import { useCmdBarEvent } from '../composables/useCmdBarEvent'
import { useCmdBarState } from '../composables/useCmdBarState'
import type { Command } from '../types'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import { computed, PropType, ComputedRef, watch, ref } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  fuse?: UseFuseOptions<Command>
  nonTriggerKeys?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  placeholder: 'Search for anything',
  fuse: () => ({}),
  nonTriggerKeys: () => ['@', '/']
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

defineSlots<{
  leading(): any
  clear(): any
}>()

const { state, updateQuery, clearQuery } = useCmdBarState()

const internalQuery = ref(props.modelValue ?? state.query)

const query = computed({
  get: () => props.modelValue ?? internalQuery.value,
  set: (value: string) => {
    internalQuery.value = value
    if (props.modelValue !== undefined) {
      emit('update:modelValue', value)
    }
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined && newValue !== internalQuery.value) {
      internalQuery.value = newValue
      updateQuery(newValue, options.value)
    }
  }
)

const options: ComputedRef<Partial<UseFuseOptions<Command>>> = computed(() => {
  return {
    fuseOptions: {
      ...props.fuse?.fuseOptions,
      keys: props.fuse?.fuseOptions?.keys ?? ['label'],
      minMatchCharLength: props.fuse?.fuseOptions?.minMatchCharLength ?? 2
    },
    resultLimit: props.fuse?.resultLimit ?? 12
  }
})

const { emitter } = useCmdBarEvent()

/**
 * handle input event
 * emit input event and store value in store
 */
function handleInput(e: Event): void {
  const inputValue = (e.target as HTMLInputElement)?.value

  if (props.nonTriggerKeys?.includes(inputValue)) {
    emitter.emit('input', inputValue)
    return
  }
  if (inputValue !== null && inputValue !== undefined) {
    query.value = inputValue
    updateQuery(inputValue, options.value)
  }

  emitter.emit('input', inputValue)
}

function handleClearQuery(): void {
  clearQuery()
  query.value = ''
  emit('update:modelValue', '')
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
      <button aria-label="Close" tabindex="-1" @click="handleClearQuery">
        <slot name="clear" />
      </button>
    </div>
  </div>
</template>
