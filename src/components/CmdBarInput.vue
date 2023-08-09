<script setup lang="ts">
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
</script>

<template>
  <input
    data-cmd-bar-input
    class="cmd-bar__input"
    autofocus
    :value="modelValue"
    :placeholder="placeholder"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
