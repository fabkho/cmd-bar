<template>
  <div :class="alertClasses" role="alert">
    <ContentSlot :use="$slots.default" unwrap="span" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value: string) => ['info', 'success', 'warning', 'error', 'dark'].includes(value)
  }
})

const alertClasses = computed(() => {
  const baseClasses = 'px-3 py-0.5 rounded-lg'

  const typeClasses: Record<string, string> = {
    info: 'text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400',
    success: 'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400',
    warning: 'text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300',
    error: 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400',
    dark: 'text-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-gray-300'
  }

  return `${baseClasses} ${typeClasses[props.type] || typeClasses.info}`
})
</script>
