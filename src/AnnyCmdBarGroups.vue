<script setup lang="ts">
import { computed, ref } from 'vue'
import { CmdBar } from './index'
import type { Command } from '@/types'
import { useMagicKeys, whenever } from '@vueuse/core'

const commandPaletteRef = ref<typeof CmdBar | null>(null)
let loading = ref(false)
const visibility = ref(false)
const keys = useMagicKeys()
const cmdK = keys['Meta+k']
const searchTerm = ref('')

const users: Command[] = [
  {
    //TODO: add href for links with target="_blank"
    id: 'benjamincanac',
    label: 'benjamincanac',
    leading: './src/assets/icons/user.svg',
    shortcuts: ['↵']
  },
  {
    id: 'Atinux',
    label: 'Atinux',
    leading: './src/assets/icons/user.svg',
    shortcuts: ['↵']
  },
  {
    id: 'smarroufin',
    label: 'smarroufin',
    leading: './src/assets/icons/user.svg',
    shortcuts: ['↵']
  }
]
const actions = [
  {
    id: 'new-file',
    label: 'Add new file',
    leading: './src/assets/icons/create.svg',
    action: () => alert('New file added'),
    shortcuts: ['⌘', 'N']
  },
  {
    id: 'new-folder',
    label: 'Add new folder',
    leading: './src/assets/icons/create.svg',
    action: () => alert('New folder added!'),
    shortcuts: ['⌘', 'F']
  },
  {
    id: 'hashtag',
    label: 'Add hashtag',
    leading: './src/assets/icons/create.svg',
    action: () => alert('Hashtag added!'),
    shortcuts: ['⌘', 'H']
  },
  {
    id: 'label',
    label: 'Add label',
    leading: './src/assets/icons/create.svg',
    action: () => alert('Label added!'),
    shortcuts: ['⌘', 'L']
  }
]

const groups = computed(() =>
  [
    {
      key: 'users',
      label: 'Users',
      commands: users
    },
    {
      key: 'actions',
      label: 'Actions',
      commands: actions
    }
  ].filter(Boolean)
)

whenever(cmdK, () => {
  visibility.value = !visibility.value
})
</script>

<template>
  <CmdBar ref="commandPaletteRef" :grouped-commands="groups">
    <CmdBar.Dialog :visible="visibility">
      <template #header>
        <CmdBar.Input :placeholder="'search fo anything'" :icon="'../assets/icons/search.svg'" />
      </template>
      <template #content>
        <CmdBar.GroupedList
          v-if="!loading"
          v-slot="{ command }"
          :item-height-in-pixel="48"
          :container-height="'21rem'"
        >
          <div class="custom-item__leading">
            <img :src="command.leading" alt="icon" />
            {{ command.label }}
          </div>
          <span v-if="command.shortcuts?.length" class="custom-item__actions">
            <kbd v-for="shortcut of command.shortcuts" :key="shortcut">{{ shortcut }}</kbd>
          </span>
        </CmdBar.GroupedList>
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
    </CmdBar.Dialog>
  </CmdBar>
</template>

<style lang="scss">
@import '@/assets/anny-theme';
</style>
