<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'search for anything'
  },
  value: {
    type: String,
    required: false,
    default: ''
  }
})

const inputRef = ref<HTMLInputElement | null>(null)
</script>

<template>
  <input
    ref="inputRef"
    autofocus
    :value="value"
    :placeholder="placeholder"
    @input="$emit('update:value', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped lang="scss"></style>
