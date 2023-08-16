<script setup lang="ts">
import { ref } from 'vue'
import { CmdBar } from './index'
import KeyboardShortcut from '@/components/KeyboardShortcut.vue'

const cmdBar = ref<typeof CmdBar | null>(null)

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
</script>

<template>
  <CmdBar :commands="items" ref="cmdBar">
    <template #header>
      <CmdBar.Input />
    </template>
    <template #content>
      <CmdBar.Items v-slot="{ item }">
        <div class="item__leading">
          <img :src="item.leading" alt="icon" />
          {{ item.title }}
        </div>
        <div class="item__actions">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M20 7V8.2C20 9.88016 20 10.7202 19.673 11.362C19.3854 11.9265 18.9265 12.3854 18.362 12.673C17.7202 13 16.8802 13 15.2 13H4M4 13L8 9M4 13L8 17"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </CmdBar.Items>
    </template>
  </CmdBar>
  <keyboard-shortcut :headless="true" :ctrl="true" shortcut="k" @detected="toggleCmdBar" />
</template>

<style lang="scss">
@import '@/assets/anny-theme';
</style>
