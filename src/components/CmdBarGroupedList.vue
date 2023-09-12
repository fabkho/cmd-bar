<script setup lang="ts">
import { useCmdBarState } from '@/useCmdBarState'
import { computed } from 'vue'
import CmdBarGroup from '@/components/CmdBarGroup.vue'

defineProps<{
  itemHeightInPixel: number
  containerHeight: string
}>()

const groupedCommands = computed(() => {
  return useCmdBarState.state.groupedCommands
})
</script>

<template>
  <div class="grouped-list">
    <div v-for="group in groupedCommands" :key="group.key" class="group">
      <h2 v-if="group.label" class="group__label">
        {{ group.label }}
      </h2>
      <CmdBarGroup
        :group="group"
        :item-height-in-pixel="itemHeightInPixel"
        :container-height="containerHeight"
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </CmdBarGroup>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
