<script setup lang="ts" generic="T">
import { computed } from 'vue'
import { USE_CMD_STATE } from '@/useCmdState'
import type { CmdBarStore } from '@/types'
import { requireInjection } from '@/utils'

defineProps<{
  items: T[]
}>()

//
defineSlots<{
  default(props: { item: T }): any
}>()

const useCmdState = requireInjection<CmdBarStore>(USE_CMD_STATE)
const selectedIndex = computed(() => useCmdState?.state.selectedItemIndex ?? 0)
</script>

<template>
  <ul data-cmd-bar-items class="cmd-bar__items">
    <li
      data-cmd-bar-item
      v-for="(item, index) in items"
      class="cmd-bar__items__item"
      :class="{ selected: index === selectedIndex }"
    >
      <slot :item="item" />
    </li>
  </ul>
</template>
