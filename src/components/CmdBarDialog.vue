<script setup lang="ts">
import { ref, type PropType, watch } from 'vue'
import { useCmdBarState } from '../useCmdBarState'

const props = defineProps({
  visible: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const dialogRef = ref<HTMLDialogElement | null>(null)

/**
 * toggle dialog
 */
function toggleCmdBar(): void {
  // if component is mounted, open dialog
  if (dialogRef.value) {
    if (dialogRef.value?.open) {
      dialogRef.value?.close()
      useCmdBarState?.resetState()
    } else {
      dialogRef.value?.showModal()
    }
  }
}

/**
 * second option: toggle commandbar on prop change
 */
watch(
  () => props.visible,
  () => toggleCmdBar()
)

/**
 * Close dialog if click is outside of dialog
 */
function handleClickOutside(): void {
  dialogRef.value?.close()
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
  unmounted(el: any) {
    document.body.removeEventListener('click', el.__ClickOutsideHandler__)
  }
}
</script>

<template>
  <dialog ref="dialogRef" data-cmd-bar class="cmd-bar" tabindex="-1">
    <div v-click-outside="handleClickOutside" data-cmd-bar-wrapper class="cmd-bar__wrapper">
      <div data-cmd-bar-header class="cmd-bar__header">
        <slot name="header" />
      </div>
      <div data-cmd-bar-content class="cmd-bar__body">
        <slot name="content" />
      </div>
      <div data-cmd-bar-footer class="cmd-bar__footer">
        <slot name="footer" />
      </div>
    </div>
  </dialog>
</template>
