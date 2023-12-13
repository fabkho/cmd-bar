<script setup lang="ts"></script>

<template>
  <div class="loading">
    <div class="leading" />
    <div class="label" />
    <div class="spacer" />
    <div class="shortcuts">
      <div class="shortcut" />
      <div class="shortcut" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/base';

.loading {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 48px;
  margin: 0.5rem;
  border-radius: calc(12px / 2);
  will-change: background;
  user-select: none;
  transition: all 150ms ease;
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
  .leading {
    margin-left: 0.5rem;
    width: 2rem;
    height: 2rem;
    border-radius: 25%;
    background-color: var(--gray6);
  }
  .label {
    width: 27.5rem;
    height: 1.15rem;
    border-radius: 0.5rem;
    background-color: var(--gray6);
  }
  .spacer {
    flex: 1;
  }
  .shortcuts {
    display: flex;
    align-items: end;
    gap: 0.5rem;
    margin-right: 0.75rem;
    .shortcut {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 0.5rem;
      background-color: var(--gray6);
    }
  }
}
</style>
