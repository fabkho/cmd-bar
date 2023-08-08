<script setup lang="ts">
import { defineComponent } from 'vue'

defineComponent({
  name: 'CmdBar'
})
</script>

<template>
  <Teleport to="body">
    <slot />
  </Teleport>
</template>

<style scoped></style>
