<script setup lang="ts">
import { type Command, useKeymap } from 'cmd-bar'

defineProps<{
  command: Command | null
  coverImage?: string
}>()

const actionsRef = ref<HTMLDivElement | null>(null)

useKeymap(() => {
  return [
    {
      key: 'Ctrl+A',
      action: () => focusActions(),
      autoRepeat: false
    }
  ]
})

/**
 * Focus the first action button, but if the first action is already focused, focus the second action button.
 */
function focusActions() {
  const buttons = actionsRef.value?.children as HTMLCollection
  const firstAction = buttons[0] as HTMLButtonElement
  const secondAction = buttons[1] as HTMLButtonElement
  if (firstAction === document.activeElement) {
    secondAction.focus()
  } else {
    firstAction.focus()
  }
}
</script>

<template>
  <div class="w-full eb-border-left ml-1 relative">
    <div class="absolute w-full">
      <div class="h-[6rem] w-full a-hero-gradient"></div>
    </div>
    <div class="pt-[3rem] px-4 h-full z-100 grid grid-rows-4 items-center justify-items-center">
      <slot name="avatar" />
      <div class="row-span-2 flex flex-col mt-8 items-center self-start">
        <slot name="data" />
      </div>
      <div ref="actionsRef" class="flex gap-4 align-self-start">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.a-hero-gradient {
  background-image: linear-gradient(135deg, #e5e5f3 0%, #f5edea 100%);
}
.dark {
  .a-hero-gradient {
    background-image: linear-gradient(135deg, #11114e 0%, #512514 100%);
  }
}
</style>
