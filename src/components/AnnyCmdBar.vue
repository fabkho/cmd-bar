<script setup lang="ts">
import { ref, computed } from 'vue'
import KeyboardShortcut from '@/components/KeyboardShortcut.vue'
import CmdBar from '@/components/CmdBar.vue'
import CmdBarInput from '@/components/CmdBarInput.vue'
import CmdBarItem from '@/components/CmdBarItem.vue'

const cmdBar = ref<typeof CmdBar | null>(null)
const searchTerm = ref('')
const selectedIndex = ref(0)

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

function toggleCmdBar(): void {
  if (cmdBar.value) {
    cmdBar.value.toggleCmdBar()
  }
}

const filteredItems = computed(() => {
  if (searchTerm.value && searchTerm.value.length > 1) {
    console.log('filteredItems', searchTerm.value, searchTerm.value)
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase()
    return items.filter((item) => item.name.toLowerCase().includes(lowerCaseSearchTerm))
  } else {
    return items
  }
})

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
</script>

<template>
  <CmdBar ref="cmdBar">
    <template #header>
      <CmdBarInput v-model="searchTerm" />
    </template>
    <template #content>
      <div v-for="(item, index) in filteredItems" :key="item.id">
        <CmdBarItem
          :icon="item.icon"
          :name="item.name"
          :class="{ selected: index === selectedIndex }"
          @keydown="handleKeyDown"
        />
      </div>
    </template>
  </CmdBar>
  <keyboard-shortcut :headless="true" :ctrl="true" shortcut="k" @detected="toggleCmdBar" />
</template>

<style lang="scss">
@import '@/assets/anny-theme';

//[cmd-item] {
//  &.selected {
//    background-color: var(--primary-color);
//    color: white;
//  }
//}
//[cmd-input] {
//  margin-bottom: 0.5rem;
//}
</style>
