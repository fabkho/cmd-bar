<script setup lang="ts">
import { ref, computed } from 'vue'
import KeyboardShortcut from '@/components/KeyboardShortcut.vue'
import CmdBar from '@/components/CmdBar.vue'
import CmdBarInput from '@/components/CmdBarInput.vue'
import CmdBarItems from '@/components/CmdBarItems.vue'

const cmdBar = ref<typeof CmdBar | null>(null)
const searchTerm = ref('')

// dummy data of 5 items for the CmdBar (id, title, icon, actions)
// the icon is a link to a random unsplash image https://source.unsplash.com/random/300×300
// actions are empty for now
const items = [
  {
    id: 1,
    title: 'New',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 2,
    title: 'Open',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 3,
    title: 'Save',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 4,
    title: 'Save As',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: []
  },
  {
    id: 5,
    title: 'Export',
    leading: 'https://source.unsplash.com/random/300×300',
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
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase()
    return items.filter((item) => item.title.toLowerCase().includes(lowerCaseSearchTerm))
  } else {
    return items
  }
})
</script>

<template>
  <CmdBar ref="cmdBar">
    <template #header>
      <CmdBarInput v-model="searchTerm" />
    </template>
    <template #content>
      <CmdBarItems v-slot="{ item }" :items="filteredItems">
        <div class="item__leading">
          <img :src="item.leading" alt="" />
        </div>
        <div class="cmd-bar__item__title">
          {{ item.title }}
        </div>
        <div class="cmd-bar__item__actions"></div>
      </CmdBarItems>
    </template>
  </CmdBar>
  <keyboard-shortcut :headless="true" :ctrl="true" shortcut="k" @detected="toggleCmdBar" />
</template>

<style lang="scss">
@import '@/assets/anny-theme';
</style>
