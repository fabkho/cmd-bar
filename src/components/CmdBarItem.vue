<script setup lang="ts">
import { defineComponent } from 'vue'

defineComponent({
  name: 'CmdBarItem',
})

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  actions: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="cmd-bar-item">
    <div class="icon-column">
      <img :src="icon" alt="Icon" class="icon" />
    </div>
    <div class="name-column">{{ name }}</div>
    <div class="actions-column">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cmd-bar-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.icon-column {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
}

.icon {
  width: 100%;
  height: 100%;
  aspect-ratio: 16/9;
}

.name-column {
  font-weight: bold;
}

.actions-column {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
