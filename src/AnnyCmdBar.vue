<script setup lang="ts">
import { ref } from 'vue'
import { CmdBar } from './index'
import type { Commands } from '@/types'
import { useMagicKeys, whenever } from '@vueuse/core'

const cmdBar = ref<typeof CmdBar | null>(null)
const keys = useMagicKeys()
const cmdK = keys['Meta+k']

// dummy data of 5 items for the CmdBar (id, title, icon, actions)
// the icon is a link to a random unsplash image https://source.unsplash.com/random/300×300
// actions are empty for now
const items: Commands = [
  {
    id: '1',
    title: 'File',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: [],
    category: 'Categories',
    description: 'File operations',
    children: [
      {
        id: '1.1',
        title: 'New',
        leading: 'https://source.unsplash.com/random/300×300',
        actions: [],
        category: 'File',
        description: 'Create a new file.'
      },
      {
        id: '1.2',
        title: 'Open',
        leading: 'https://source.unsplash.com/random/300×300',
        actions: [],
        category: 'File',
        description: 'Open an existing file.'
      }
    ]
  },
  {
    id: '2',
    title: 'Edit',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: [],
    category: 'Categories',
    description: 'Edit operations',
    children: [
      {
        id: '2.1',
        title: 'Cut',
        leading: 'https://source.unsplash.com/random/300×300',
        actions: [],
        category: 'Edit',
        description: 'Cut selected content.'
      },
      {
        id: '2.2',
        title: 'Copy',
        leading: 'https://source.unsplash.com/random/300×300',
        actions: [],
        category: 'Edit',
        description: 'Copy selected content.'
      }
    ]
  },
  {
    id: '3',
    title: 'View',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: [],
    category: 'Categories',
    description: 'View operations',
    children: [
      {
        id: '3.1',
        title: 'Zoom In',
        leading: 'https://source.unsplash.com/random/300×300',
        actions: [],
        category: 'View',
        description: 'Zoom in on the content.'
      },
      {
        id: '3.2',
        title: 'Zoom Out',
        leading: 'https://source.unsplash.com/random/300×300',
        actions: [],
        category: 'View',
        description: 'Zoom out on the content.'
      }
    ]
  },
  {
    id: '4',
    title: 'Help',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: [],
    category: 'Categories',
    description: 'Help operations',
    children: [
      {
        id: '4.1',
        title: 'About',
        leading: 'https://source.unsplash.com/random/300×300',
        actions: [],
        category: 'Help',
        description: 'Open the About dialog.'
      },
      {
        id: '4.2',
        title: 'Documentation',
        leading: 'https://source.unsplash.com/random/300×300',
        actions: [],
        category: 'Help',
        description: 'Open the documentation.'
      }
    ]
  },
  {
    id: '5',
    title: 'Settings',
    leading: 'https://source.unsplash.com/random/300×300',
    actions: [],
    category: 'Categories',
    description: 'Settings operations',
    children: [
      {
        id: '5.1',
        title: 'General',
        leading: 'https://source.unsplash.com/random/300×300',
        actions: [],
        category: 'Settings',
        description: 'Open the general settings.'
      },
      {
        id: '5.2',
        title: 'Advanced',
        leading: 'https://source.unsplash.com/random/300×300',
        actions: [],
        category: 'Settings',
        description: 'Open the advanced settings.'
      }
    ]
  }
]

whenever(cmdK, () => {
  if (cmdBar.value) {
    cmdBar.value.toggleCmdBar()
  }
})
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
          <!--          <span>-->
          <!--            <svg-->
          <!--              xmlns="http://www.w3.org/2000/svg"-->
          <!--              width="800px"-->
          <!--              height="800px"-->
          <!--              viewBox="0 0 24 24"-->
          <!--              fill="none"-->
          <!--            >-->
          <!--              <path-->
          <!--                d="M20 7V8.2C20 9.88016 20 10.7202 19.673 11.362C19.3854 11.9265 18.9265 12.3854 18.362 12.673C17.7202 13 16.8802 13 15.2 13H4M4 13L8 9M4 13L8 17"-->
          <!--                stroke="#000000"-->
          <!--                stroke-width="2"-->
          <!--                stroke-linecap="round"-->
          <!--                stroke-linejoin="round"-->
          <!--              />-->
          <!--            </svg>-->
          <!--          </span>-->
          <span>
            <svg
              fill="#000000"
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 4.25a.75.75 0 00-1.5 0v15a.75.75 0 001.5 0v-15zm-9.72 14.28a.75.75 0 11-1.06-1.06l4.97-4.97H1.75a.75.75 0 010-1.5h14.44l-4.97-4.97a.75.75 0 011.06-1.06l6.25 6.25a.75.75 0 010 1.06l-6.25 6.25z"
              />
            </svg>
          </span>
        </div>
      </CmdBar.Items>
    </template>
  </CmdBar>
</template>

<style lang="scss">
@import '@/assets/anny-theme';
</style>
