<template>
  <header></header>

  <main>
    <Suspense>
      <AnnyCmdBar />
    </Suspense>
  </main>
</template>

<script setup lang="ts">
import AnnyCmdBar from '@/AnnyCmdBar.vue'
</script>

<style scoped></style>
