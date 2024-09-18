<script setup lang="ts">
import { useKeymap } from '../composables/useKeymap'
import { ref, type PropType, watch } from 'vue'
import { useCmdBarState } from '../composables/useCmdBarState'

// Props to control visibility
const props = defineProps({
  visible: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

defineSlots<{
  header(): any
  content(): any
  footer(): any
}>()

// Reference to the dialog element
const dialogRef = ref<HTMLDialogElement | null>(null)

// Use the keymap composable
const { addEventListener, removeEventListener } = useKeymap((nav) => [
  {
    key: 'ArrowUp',
    action: () => nav.next(),
    autoRepeat: true
  },
  {
    key: 'ArrowDown',
    action: () => nav.prev(),
    autoRepeat: true
  },
  {
    key: 'Enter',
    action: () => nav.execute(),
    autoRepeat: true
  }
])

/**
 * Event handler to close dialog when clicking outside
 */
function handleClickOutside(): void {
  dialogRef.value?.close()
}

// Vue directive to handle outside clicks
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

const { resetState } = useCmdBarState

function onDialogOpen() {
  emit('update:visible', true)
  addEventListener()
}

function onDialogClose() {
  emit('update:visible', false)
  removeEventListener()
  resetState()
}

/**
 * Set up event listeners on dialog element
 */
watch(dialogRef, (newVal) => {
  if (newVal) {
    newVal.addEventListener('close', onDialogClose)
    newVal.addEventListener('show', onDialogOpen)
  }
})

// Watch for changes in visibility prop and toggle the dialog accordingly
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      addEventListener()
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
      removeEventListener()
    }
  }
)
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
