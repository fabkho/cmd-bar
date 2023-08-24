<script setup lang="ts">
import store from '@/useCmdBarState'

defineProps({
  placeholder: {
    type: String,
    default: 'search for anything'
  }
})

const emit = defineEmits<{
  (e: 'input', val: any): void
}>()

/**
 * handle input event
 * emit input event and store value in store
 */
function handleInput(e: Event): void {
  const target = e.target as HTMLInputElement
  const value = target.value
  emit('input', value)
  store.setSearchTerm(value)
}
</script>

<template>
  <input
    data-cmd-bar-input
    class="cmd-bar__input"
    autofocus
    :value="store?.state.searchTerm"
    :placeholder="placeholder"
    @input="handleInput"
  />
</template>
