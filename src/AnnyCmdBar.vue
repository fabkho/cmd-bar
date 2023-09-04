<script setup lang="ts">
import { ref, watch } from 'vue'
import { CmdBar } from './index'
import type { Commands } from '@/types'
import { useMagicKeys, whenever } from '@vueuse/core'

const cmdBar = ref<typeof CmdBar | null>(null)
const keys = useMagicKeys()
const cmdK = keys['Meta+k']
const searchTerm = ref('test')

// dummy data of 5 items for the CmdBar (id, title, icon, actions)
// the icon is a link to a random unsplash image https://source.unsplash.com/random/300×300
// actions are empty for now
const items: Commands = [
  {
    id: '1',
    leading: './src/assets/icons/user.svg',
    title: 'Thomas Shelby',
    action: () => {
      alert('I need a cigarette')
    },
    actionClosesCmdBar: true,
    groups: ['ALL', 'User'],
    description: 'File operations'
  },
  {
    id: '2',
    leading: './src/assets/icons/user.svg',
    title: 'Arthur Shelby',
    action: () => {
      alert('Arthur will kill you!')
    },
    actionClosesCmdBar: false,
    groups: ['ALL', 'User'],
    description: 'Edit operations'
  },
  {
    id: '3',
    leading: './src/assets/icons/create.svg',
    title: 'Booking',
    action: () => {
      alert('create Booking!')
    },
    actionClosesCmdBar: false,
    groups: ['ALL', 'Create'],
    description: 'View operations'
  },
  {
    id: '4',
    leading: './src/assets/icons/create.svg',
    title: 'Resource',
    action: () => {
      alert('create Resource')
    },
    actionClosesCmdBar: false,
    groups: ['ALL', 'Create'],
    description: 'Help operations'
  },
  {
    id: '5',
    leading: './src/assets/icons/settings.svg',
    title: 'Settings',
    action: () => {
      alert('Settings action triggered!')
    },
    actionClosesCmdBar: false,
    groups: ['ALL', 'Setting'],
    description: 'Settings operations'
  },
  {
    id: '1',
    leading: './src/assets/icons/user.svg',
    title: 'Thomas Shelby',
    action: () => {
      alert('I need a cigarette')
    },
    actionClosesCmdBar: true,
    groups: ['ALL', 'User'],
    description: 'File operations'
  },
  {
    id: '2',
    leading: './src/assets/icons/user.svg',
    title: 'Arthur Shelby',
    action: () => {
      alert('Arthur will kill you!')
    },
    actionClosesCmdBar: false,
    groups: ['ALL', 'User'],
    description: 'Edit operations'
  },
  {
    id: '3',
    leading: './src/assets/icons/create.svg',
    title: 'Booking',
    action: () => {
      alert('create Booking!')
    },
    actionClosesCmdBar: false,
    groups: ['ALL', 'Create'],
    description: 'View operations'
  },
  {
    id: '4',
    leading: './src/assets/icons/create.svg',
    title: 'Resource',
    action: () => {
      alert('create Resource')
    },
    actionClosesCmdBar: false,
    groups: ['ALL', 'Create'],
    description: 'Help operations'
  },
  {
    id: '5',
    leading: './src/assets/icons/settings.svg',
    title: 'Settings',
    action: () => {
      alert('Settings action triggered!')
    },
    actionClosesCmdBar: false,
    groups: ['ALL', 'Setting'],
    description: 'Settings operations'
  }
]

const groups = items.flatMap((item) => item.groups)
const defaultFilterOption = 'ALL'

whenever(cmdK, () => {
  if (cmdBar.value) {
    cmdBar.value.toggleCmdBar()
  }
})

// watch and log searchTerm
watch(searchTerm, (newVal) => {
  console.log(newVal)
})
</script>

<template>
  <CmdBar ref="cmdBar" :commands="items" loop>
    <template #header>
      <CmdBar.Input
        v-model="searchTerm"
        :placeholder="'search fo anything'"
        :icon="'../assets/icons/search.svg'"
      />
      <CmdBar.Filter :filter-options="groups" :default-filter-option="defaultFilterOption" />
    </template>
    <template #content>
      <CmdBar.List v-slot="{ item }" :item-height="48">
        <div class="custom-item__leading">
          <img :src="item.leading" alt="icon" />
          {{ item.title }}
        </div>
        <div class="custom-item__actions">
          <kbd key="enter">↵</kbd>
        </div>
      </CmdBar.List>
    </template>
    <template #footer>
      <span class="custom-footer__trigger">
        Execute Command
        <kbd>↵</kbd>
      </span>

      <hr />
      <span class="custom-footer__subTrigger">
        Navigate
        <kbd>↑</kbd>
        <kbd>↓</kbd>
      </span>
    </template>
  </CmdBar>
</template>

<style lang="scss">
@import '@/assets/anny-theme';
</style>
