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
    leading: 'https://source.unsplash.com/random/300×300',
    title: 'Thomas Shelby',
    action: () => {
      alert('I need a cigarette')
    },
    actionClosesCmdBar: true,
    group: 'User',
    description: 'File operations'
  },
  {
    id: '2',
    leading: 'https://source.unsplash.com/random/300×300',
    title: 'Arthur Shelby',
    action: () => {
      alert('Arthur will kill you!')
    },
    actionClosesCmdBar: false,
    group: 'User',
    description: 'Edit operations'
  },
  {
    id: '3',
    leading: 'https://source.unsplash.com/random/300×300',
    title: 'Gun',
    action: () => {
      alert('Peng!')
    },
    actionClosesCmdBar: false,
    group: 'Equipment',
    description: 'View operations'
  },
  {
    id: '4',
    leading: 'https://source.unsplash.com/random/300×300',
    title: 'Knife',
    action: () => {
      alert('u dead!')
    },
    actionClosesCmdBar: false,
    group: 'actionClosesCmdBar',
    description: 'Help operations'
  },
  {
    id: '5',
    leading: 'https://source.unsplash.com/random/300×300',
    title: 'Settings',
    action: () => {
      alert('Settings action triggered!')
    },
    actionClosesCmdBar: false,
    group: 'Setting',
    description: 'Settings operations'
  }
]

whenever(cmdK, () => {
  if (cmdBar.value) {
    cmdBar.value.toggleCmdBar()
  }
})
</script>

<template>
  <CmdBar
    :commands="items"
    :keybindings="{ arrowUp: 'arrowup', arrowDown: 'arrowdown', enter: 'enter' }"
    ref="cmdBar"
  >
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
          <kbd key="enter">↵</kbd>
        </div>
      </CmdBar.Items>
    </template>
  </CmdBar>
</template>

<style lang="scss">
@import '@/assets/anny-theme';
</style>
