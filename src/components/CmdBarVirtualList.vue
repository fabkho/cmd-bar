<script setup lang="ts">
import { useCmdBarEvent } from '../composables/useCmdBarEvent'
import { useVirtualList } from '@vueuse/core'
import { computed, type ComputedRef, nextTick, ref, watch, watchEffect } from 'vue'
import { Command } from '../types'
import type { Group } from '../types'
import { useCmdBarState } from '../composables/useCmdBarState'
import CmdBarGroup from './CmdBarGroup.vue'

const props = defineProps<{
  config: {
    itemHeightInPixel: number | Record<string, number>
    containerHeight: string
    groupLabelHeightInPixel?: number
  }
}>()

// causes type error!?!?!?
// defineSlots<{
//   default(props: { command: Command }): any
//   preview(props: { command: Command | null }): any
//   loading(props: { group: Group }): any
// }>()

const labelRef = ref<HTMLElement[] | null>(null) // Create a ref for the label element
const activeCommand = ref<Command | null>(null)

/**
 * problem: the group header has to be included in the list to calculate the correct height
 * solution: flatten grouped commands, to use with virtual list
 *
 */
const visibleItems = computed(() => {
  return useCmdBarState?.state.filteredGroupedCommands.flatMap((group) => {
    const groupWithoutCommands = { key: group.key, label: group.label }
    return group.commands ? [groupWithoutCommands, ...group.commands] : [groupWithoutCommands]
  })
})

const { containerProps, wrapperProps, list } = useVirtualList(visibleItems as ComputedRef, {
  itemHeight: (index: number) => {
    const command = visibleItems.value[index] as Command | string

    // set height for group header
    if (typeof command === 'string') {
      return props.config.groupLabelHeightInPixel ?? 0
    }

    // set fixed height for item
    if (typeof props.config.itemHeightInPixel === 'number') {
      return props.config.itemHeightInPixel
    }

    // set height for item based on group
    const group = command?.group
    if (!group) {
      // command.group is not set yet (e.g. on initial load)
      return 0
    }

    if (!props.config.itemHeightInPixel[group]) {
      console.error(
        `No height defined for group "${group}". Please define a height for this group in the config for the list component.`
      )
    }

    return props.config.itemHeightInPixel[group]
  }
})

/**
 * group commands by group key
 */
const groupedCommands = computed(() => {
  return list.value.reduce((result: Group[], item) => {
    const groupKey = item.data.key || item.data.group

    // Find an existing group object or create a new one if it doesn't exist
    const group = result.find((g: Group) => g.key === groupKey)
    if (!group) {
      const newGroup = {
        key: groupKey,
        label: item.data.label,
        commands: []
      } as Group
      result.push(newGroup)
    } else if (item.data.id) {
      group.commands?.push(item.data)
    }

    return result
  }, [])
})

/* set fixed height for container */
watchEffect(() => {
  containerProps.style = {
    height: props.config.containerHeight
  }
})

/* set fixed height for label */
watchEffect(() => {
  labelRef.value?.forEach((label) => {
    label.style.height = `${props.config.groupLabelHeightInPixel}px`
  })
})

/* handle scroll to selected item */
const getSelectedItem = () => {
  const selectedId = useCmdBarState?.state.selectedCommandId
  return containerProps.ref.value?.querySelector(`[data-id="${selectedId}"]`) as HTMLElement
}

const scrollSelectedIntoView = () => {
  const item = getSelectedItem()
  // if item is first element of group, make sure header/label is in view
  if (item?.parentElement?.firstElementChild === item) {
    item?.closest('.group')?.querySelector('.group__label')?.scrollIntoView({ block: 'nearest' })
    return
  }
  item?.scrollIntoView({ block: 'nearest' })
}

const { emitter } = useCmdBarEvent()

emitter.on('selected', (command: Command) => {
  activeCommand.value = command
})

watch(
  () => useCmdBarState?.state.selectedCommandId,
  (newVal) => {
    if (newVal) {
      nextTick(scrollSelectedIntoView)
    }
  }
)
</script>

<template>
  <div class="grouped-list" v-bind="containerProps">
    <ul data-cmd-bar-items class="list-items" v-bind="wrapperProps">
      <li v-for="group in groupedCommands" :key="group.key" class="group">
        <h2
          v-if="group.label && group.commands && group.commands?.length > 0"
          ref="labelRef"
          class="group__label"
        >
          {{ group.label }}
        </h2>
        <CmdBarGroup :group="group">
          <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </CmdBarGroup>
      </li>
    </ul>
  </div>
  <slot name="preview" :command="activeCommand" />
</template>

<style scoped lang="scss"></style>
