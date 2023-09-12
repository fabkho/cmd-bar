<script setup lang="ts">
import { useCmdBarState } from '@/useCmdBarState'
import { computed, watch } from 'vue'
import CmdBarGroup from '@/components/CmdBarGroup.vue'
import { useVirtualList } from '@vueuse/core'
import { ComputedRef } from 'vue/dist/vue'

const props = defineProps<{
  itemHeightInPixel: number
  containerHeight: string
}>()

const groupedCommands = computed(() => {
  return useCmdBarState.state.groupedCommands
})

const visibleItems = computed(() => {
  return useCmdBarState?.state.commands
})

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  visibleItems as ComputedRef,
  {
    itemHeight: props.itemHeightInPixel
  }
)

// set fixed height for container
watch(
  () => props.containerHeight,
  () => {
    containerProps.style = {
      height: props.containerHeight
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="grouped-list" v-bind="containerProps">
    <ul data-cmd-bar-items class="list-items" v-bind="wrapperProps">
      <li v-for="group in groupedCommands" :key="group.key" class="group">
        <h2 v-if="group.label" class="group__label">
          {{ group.label }}
        </h2>
        <CmdBarGroup :group="group">
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </CmdBarGroup>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss"></style>
