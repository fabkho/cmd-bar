<template>
  <header></header>

  <main>
    <client-only>
      <AnnyCmdBar />
    </client-only>
  </main>
</template>

<script setup lang="ts">
import AnnyCmdBar from './components/CmdBar.vue'
</script>

<style scoped></style>
