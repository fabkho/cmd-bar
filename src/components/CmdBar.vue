<script setup lang="ts">
import { ref } from 'vue'

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
 * @param event
 */
function handleClickOutside(event: MouseEvent): void {
  if (
    !(
      dialogContent.value === (event.target as HTMLDivElement) ||
      dialogContent.value?.contains(event.target as Node)
    )
  ) {
    dialog.value?.close()
  }
}
</script>

<template>
  <dialog
    data-cmd-bar
    class="cmd-bar"
    ref="dialog"
    @click="handleClickOutside"
    @keydown="handleKeyDown"
  >
    <div data-cmd-bar-wrapper class="cmd-bar__wrapper" ref="dialogContent">
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
