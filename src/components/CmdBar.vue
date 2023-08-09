<script setup lang="ts">
import { ref, defineComponent, computed } from 'vue'
import CmdBarInput from '@/components/CmdBarInput.vue'
import CmdBarItem from '@/components/CmdBarItem.vue'

defineComponent({
  name: 'CmdBar'
})

const dialog = ref<HTMLDialogElement | null>(null)
const dialogContent = ref<HTMLDivElement | null>(null)
const searchTerm = ref('')
const selectedIndex = ref(0)

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()

    if (event.key === 'ArrowUp') {
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    } else if (event.key === 'ArrowDown') {
      console.log('down')
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredItems.value.length - 1)
    }
  }
}

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

defineExpose({
  toggleCmdBar
})

// dummy data of 5 items for the CmdBar (id, name, icon, actions)
// the icon is a link to a ransom unsplash image https://source.unsplash.com/random/300×300
// actions are empty for now
const items = [
  {
    id: 1,
    name: 'New',
    icon: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 2,
    name: 'Open',
    icon: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 3,
    name: 'Save',
    icon: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 4,
    name: 'Save As',
    icon: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 5,
    name: 'Export',
    icon: 'https://source.unsplash.com/random/300×300',
    actions: []
  }
]

const filteredItems = computed(() => {
  if (searchTerm.value && searchTerm.value.length > 1) {
    console.log('filteredItems', searchTerm.value, searchTerm.value)
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase()
    return items.filter((item) => item.name.toLowerCase().includes(lowerCaseSearchTerm))
  } else {
    return items
  }
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
  <div>
    <dialog ref="dialog" @click="handleClickOutside" @keydown="handleKeyDown">
      <div ref="dialogContent">
        <CmdBarInput v-model="searchTerm" />
        <div v-for="(item, index) in filteredItems" :key="item.id">
          <CmdBarItem
            cmd-item
            :icon="item.icon"
            :name="item.name"
            :class="{ selected: index === selectedIndex }"
          />
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped lang="scss">
dialog {
  pointer-events: none;
  position: relative;
  background-color: var(--panel-background);
  border-radius: var(--panel-border-radius);
  box-shadow: var(--panel-shadow);
  max-width: 95%;
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 576px) {
    width: 100%;
  }

  &[open] {
    animation: dialog 0.2s ease forwards;
    pointer-events: inherit;
  }

  [cmd-item] {
    &.selected {
      background-color: var(--primary-color);
      color: white;
    }
  }

  //&:hover {
  //  color: var(--primary-color);
  //  //color: var(--primary-color-hover);
  //  background-color: var(--panel-background-dark);
  //}
  //&::backdrop {
  //  backdrop-filter: blur(5px);
  //}
}

@keyframes dialog {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
