<script setup lang="ts">
import { ref } from 'vue'
import { CmdBar } from './index'
import type { Command, Commands } from '@/types'
import { useFetch, useMagicKeys, whenever } from '@vueuse/core'
import { useDefineCommand } from '@/useDefineCommand'

const cmdBar = ref<typeof CmdBar | null>(null)
const items = ref<Commands>([])
const visibility = ref(false)
const keys = useMagicKeys()
const cmdK = keys['Meta+k']
const searchTerm = ref('')

//TODO:
// - fetch commands from faker API
await useFetch('https://jsonplaceholder.typicode.com/users', {
  afterFetch(ctx) {
    items.value = transformUserDataToCommand(ctx.data)
    return ctx
  }
}).json()

function transformUserDataToCommand(userData: Record<string, any>[]): Command[] {
  return userData.map((user: Record<string, any>) =>
    useDefineCommand({
      id: user.id.toString(),
      leading: './src/assets/icons/user.svg',
      title: user.name,
      groups: [], // You can set this as needed.
      description: user.email, // You can choose a relevant property for 'description'.
      action: () => {
        // Define your action here.
      },
      actionClosesCmdBar: false // You can set this as needed.
    })
  )
}

const defaultItems: Commands = [
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

const groups = defaultItems.flatMap((item) => item.groups)
const defaultFilterOption = 'ALL'

// async function handleUpdate() {
//   const { data } = await useFetch(`https://fakerapi.it/api/v1/persons?name=${searchTerm.value}`, {
//     onResponse({ request, response, options }) {
//       console.log(request, response, options)
//     }
//   })
//   console.log(data)
// }

whenever(cmdK, () => {
  visibility.value = !visibility.value
  console.log('visibility', visibility.value)
})
</script>

<template>
  <CmdBar :commands="items">
    <CmdBar.Dialog :visible="visibility" loop>
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
    </CmdBar.Dialog>
  </CmdBar>
</template>

<style lang="scss">
@import '@/assets/anny-theme';
</style>
