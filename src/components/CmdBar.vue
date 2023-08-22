<script setup lang="ts">
import { ref, type PropType, toRef, computed } from 'vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import store from '@/useCmdBarState'
import type { Commands } from '@/types'

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
const dialogContent = ref<HTMLDivElement | null>(null)
const keys = useMagicKeys()
const metaK = ref(['Meta+k'])

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

whenever(keys.arrowUp, () => {
  store?.nextCommand()
})

whenever(keys.arrowDown, () => {
  store?.prevCommand()
})

// listen for meta+ k and toggle commandbar
whenever(metaK, () => {
  toggleCmdBar()
})

whenever(keys.Tab, () => {
  console.log('tab')
  // now we need to show the child commands of the current selected command
  const children = computed(() => store?.getChildren(store?.state.selectedCommandId ?? ''))
  console.log(children.value)
})
</script>

<template>
  <dialog data-cmd-bar class="cmd-bar" ref="dialog">
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
