<script setup lang="ts">
import { computed, inject } from 'vue'
import type { State } from '@/types'
import { USE_CMD_STATE } from '@/useCmdState'

defineProps({
  placeholder: {
    type: String,
    default: 'search for anything'
  },
  modelValue: {
    type: String,
    required: false,
    default: ''
  }
})

defineEmits<{
  (e: 'update:modelValue', val: any): void
}>()

const useCmdState = inject<State>(USE_CMD_STATE)

//log it as a computed
const computedValue = computed(() => {
  console.log('computedValue', useCmdState)
})
</script>

<template>
  <input
    data-cmd-bar-input
    class="cmd-bar__input"
    autofocus
    :value="modelValue"
    :placeholder="useCmdState.searchTerm"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
