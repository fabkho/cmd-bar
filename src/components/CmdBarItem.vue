<template>
  <div data-cmd-bar-item class="cmd-bar__item">
    <div class="cmd-bar__item__icon">
      <img :src="icon" alt="Icon" />
    </div>
    <div class="cmd-bar__item__name">{{ name }}</div>
    <div class="cmd-bar__item__actions">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  actions: {
    type: Array,
    default: () => []
  }
})
</script>
