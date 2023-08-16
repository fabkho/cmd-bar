<script setup lang="ts">
import { ref, watch, type PropType } from 'vue'
import store from '@/useCmdBarState'

const props = defineProps({
  commands: {
    type: Array as PropType<Record<string, any>>,
    required: true
  },
  visible: {
    type: Boolean as PropType<boolean | null>,
    required: false,
    default: null
  }
})

const dialog = ref<HTMLDialogElement | null>(null)
const dialogContent = ref<HTMLDivElement | null>(null)

// provide items
store?.setCommands(props.commands)

/**
 * toggle dialog
 */
function toggleCmdBar(): void {
  // if component is mounted, open dialog
  if (dialog.value) {
    if (dialog.value?.open || props.visible === false) {
      dialog.value?.close()
      store?.resetState()
    } else {
      dialog.value?.showModal()
    }
  }
}

/**
 * first option: toggle commandbar via exposed function
 */
defineExpose({
  toggleCmdBar
})

/**
 * second option: toggle commandbar on prop change
 */
watch(
  () => props.visible,
  () => {
    toggleCmdBar()
  },
  { immediate: true }
)

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

/**
 * Handle keyboard events
 * @param event
 */
function handleKeyDown(event: KeyboardEvent): void {
  //TODO: handle more keys in Composable helper
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()

    if (event.key === 'ArrowUp') {
      console.log('next item')
      store?.nextCommand()
    } else if (event.key === 'ArrowDown') {
      store?.prevCommand()
    }
  }
}
</script>

<template>
  <dialog data-cmd-bar class="cmd-bar" ref="dialog" @keydown="handleKeyDown">
    <div
      data-cmd-bar-wrapper
      class="cmd-bar__wrapper"
      ref="dialogContent"
      v-click-outside="handleClickOutside"
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
