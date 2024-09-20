<script setup lang="ts">
import CmdBarItems from '../components/CmdBarItems.vue'
import type { Command, Group } from '../types'

defineProps<{
  group: Group
}>()

defineEmits<{
  selected: [command: Command]
  clicked: [command: Command]
}>()

defineSlots<{
  default(props: { command: Command }): any
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
  </div>
</template>

<style scoped lang="scss"></style>
