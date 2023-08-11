<script setup lang="ts">
import { ref } from 'vue'
import { USE_CMD_STATE } from '@/useCmdState'
import type { CmdBarStore } from '@/types'
import { requireInjection } from '@/utils'

const useCmdState = requireInjection<CmdBarStore>(USE_CMD_STATE)

const items = ref(useCmdState?.state.items ?? [])
const dialog = ref<HTMLDialogElement | null>(null)
const dialogContent = ref<HTMLDivElement | null>(null)
const selectedIndex = ref(0)

/**
 * toggle dialog
 */
function toggleCmdBar(): void {
  // if component is mounted, open dialog
  if (dialog.value) {
    if (dialog.value?.open) {
      dialog.value?.close()
    } else {
      dialog.value?.showModal()
    }
  }
}

/**
 * expose toggleCmdBar function to parent component
 */
defineExpose({
  toggleCmdBar
})

/**
 * Close dialog if click is outside of dialog
 */
function handleClickOutside(): void {
  dialog.value?.close()
}

const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.__ClickOutsideHandler__ = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event, el)
      }
    }
    document.body.addEventListener('click', el.__ClickOutsideHandler__)
  },
  unmount(el: HTMLElement) {
    document.body.removeEventListener('click', el.__ClickOutsideHandler__)
  }
}

/**
 * Handle keyboard events
 * @param event
 */
function handleKeyDown(event: KeyboardEvent): void {
  //TODO: handle more keys
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()

    if (event.key === 'ArrowUp') {
      useCmdState?.nextItem()
    } else if (event.key === 'ArrowDown') {
      useCmdState?.prevItem()
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
