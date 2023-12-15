<template>
  <header></header>

  <main>
    <client-only>
      <CmdBar />
    </client-only>
  </main>
</template>

<script setup lang="ts">
import CmdBar from './components/CmdBar.vue'
</script>

<style scoped></style>
