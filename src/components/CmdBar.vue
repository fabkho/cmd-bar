<script setup lang="ts">
import { ref, type PropType, toRef } from 'vue'
import { whenever } from '@vueuse/core'
import { useCmdBarState } from '@/useCmdBarState'
import type { Commands, Keybindings } from '@/types'

const props = defineProps({
  commands: {
    type: Array as PropType<Commands>,
    required: true
  },
  visible: {
    type: Boolean as PropType<boolean | null>,
    required: false,
    default: null
  }
})

const dialog = ref<HTMLDialogElement | null>(null)

// provide items
useCmdBarState?.registerCommands(props.commands)

/**
 * toggle dialog
 */
function toggleCmdBar(): void {
  // if component is mounted, open dialog
  if (dialog.value) {
    if (dialog.value?.open || props.visible === false) {
      dialog.value?.close()
      useCmdBarState?.resetState()
    } else {
      dialog.value?.showModal()
    }
  }
}
// provide toggle function to store
useCmdBarState.registerToggleCmdBar(toggleCmdBar)

/**
 * first option: toggle commandbar via exposed function
 */
defineExpose({
  toggleCmdBar
})

/**
 * second option: toggle commandbar on prop change
 */
whenever(toRef(props.visible) ?? false, () => {
  toggleCmdBar()
})

/**
 * Close dialog if click is outside of dialog
 */
function handleClickOutside(): void {
  dialog.value?.close()
}

const vClickOutside = {
  mounted(el: any, binding: any) {
    el.__ClickOutsideHandler__ = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event, el)
      }
    }
    document.body.addEventListener('click', el.__ClickOutsideHandler__)
  },
  unmount(el: any) {
    document.body.removeEventListener('click', el.__ClickOutsideHandler__)
  }
}

function handleKeyDown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowUp':
      useCmdBarState?.nextCommand()
      break
    case 'ArrowDown':
      useCmdBarState?.prevCommand()
      break
    case 'ArrowLeft':
      // Insert your custom logic here
      break
    case 'ArrowRight':
      // Insert your custom logic here
      break
    case 'Enter':
      useCmdBarState?.executeCommand()
      break
    default:
      // Insert your custom logic here
      break
  }
}
</script>

<template>
  <dialog ref="dialog" data-cmd-bar class="cmd-bar">
    <div
      v-click-outside="handleClickOutside"
      data-cmd-bar-wrapper
      class="cmd-bar__wrapper"
      @keydown="handleKeyDown"
    >
      <div data-cmd-bar-header class="cmd-bar__header">
        <slot name="header" />
      </div>
      <div data-cmd-bar-content class="cmd-bar__content">
        <slot name="content" />
      </div>
      <div data-cmd-bar-footer class="cmd-bar__footer">
        <slot name="footer" />
      </div>
    </div>
  </dialog>
</template>
