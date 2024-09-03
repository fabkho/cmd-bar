<script setup lang="ts">
import { ref, PropType } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  suggestions: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => ['Suggestion 1', 'Suggestion 2', 'Suggestion 3']
  }
})

const emit = defineEmits<{
  suggestionSelected: [suggestion: string]
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

function openDialog() {
  if (dialogRef.value) {
    dialogRef.value.show()
  }
}

function closeDialog() {
  if (dialogRef.value) {
    dialogRef.value.close()
  }
}

watch(
  () => props.visible,
  () => {
    props.visible ? openDialog() : closeDialog()
  }
)
function handleDialogKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && props.suggestions.length > 0) {
    selectSuggestion(props.suggestions[0]) // Select first suggestion on pressing Enter
  }
}

function selectSuggestion(suggestion: string) {
  // Emit an event to the parent component to inform about the selected suggestion
  emit('suggestionSelected', suggestion)
  closeDialog()
}

function preventTabBreakout(event: KeyboardEvent) {
  // TODO: as long as the dialog is open, prevent tab from breaking out of the dialog
}
</script>

<template>
  <dialog
    ref="dialogRef"
    tabindex="-1"
    class="ml-14 !z-10 w-[12rem] rounded-lg bg-gray-300 dark:bg-zinc-800 dark:text-zinc-200 p-1"
    @keydown="handleDialogKeyDown"
  >
    <ul class="flex flex-col gap-2">
      <li
        v-for="(suggestion, index) in suggestions"
        :key="index"
        tabindex="0"
        class="hover:bg-neutral-400 dark:hover:bg-neutral-200 focus:bg-neutral-700 focus:outline-none dark:focus:bg-neutral-600 rounded-md p-2 cursor-pointer"
        @click="selectSuggestion(suggestion)"
      >
        <div class="flex items-center gap-3">
          <img
            class="w-6 h-6 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
            src="../assets/avatars/avatar-1.png"
            alt="Bordered avatar"
            style="z-index: 1"
          />
          {{ suggestion }}
        </div>
      </li>
    </ul>
  </dialog>
</template>

<style scoped lang="scss">
///* Style the dialog */
dialog {
  //z-index: 9999;
}
//
///* Style the suggestions list */
//ul {
//  list-style: none;
//  padding: 0;
//}
//
//li {
//  cursor: pointer;
//  padding: 5px;
//}
//
//li:hover {
//  background-color: #f0f0f0;
//}
</style>
