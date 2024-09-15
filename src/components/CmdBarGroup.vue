<script setup lang="ts">
import CmdBarItems from '@/Users/fabiankirchhoff/code/cmd-bar/src/components/CmdBarItems.vue'
import type { Command, Group } from '../types'

defineProps<{
  group: Group
}>()

defineEmits<{
  selected: [command: Command]
  clicked: [command: Command]
}>()
</script>

<template>
  <div class="group-container">
    <ul v-if="group.commands" data-cmd-bar-items class="items">
      <CmdBarItems v-bind="$attrs" :commands="group.commands">
        <template #default="{ command }">
          <slot :command="command" />
        </template>
      </CmdBarItems>
    </ul>
    <div v-else class="loading">
      <slot name="loading" :group="group" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
