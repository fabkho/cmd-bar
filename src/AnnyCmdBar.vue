<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { CmdBar } from './index'
import type { Commands } from '@/types'
import { useFetch, useMagicKeys, whenever } from '@vueuse/core'
import { useDefineCommand } from '@/useDefineCommand'

const cmdBar = ref<typeof CmdBar | null>(null)
const users = ref<Commands>([])
let loading = ref(false)
const visibility = ref(false)
const keys = useMagicKeys()
const cmdK = keys['Meta+k']
const searchTerm = ref('')

const listConfig = {
  itemHeightInPixel: 48,
  containerHeight: '21rem',
  groupLabelHeightInPixel: 20
}

async function fetchUsers() {
  const { data } = await useFetch(
    'https://dummyjson.com/users?limit=10&select=id,firstName,lastName',
    {
      beforeFetch(ctx) {
        loading.value = true
        return ctx
      }
    }
  ).json()
  users.value = data.value.users.map((user: Record<string, any>) => {
    return useDefineCommand({
      id: user.id.toString(),
      leading: './src/assets/icons/user.svg',
      label: `${user.firstName} ${user.lastName}`,
      action: () => {
        // Define your action here.
      }
    })
  })
  loading.value = false
}

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

const actions2 = [
  {
    id: 'new-file1',
    label: 'Add new file',
    leading: './src/assets/icons/create.svg',
    action: () => alert('New file added'),
    shortcuts: ['⌘', 'N']
  },
  {
    id: 'new-folder1',
    label: 'Add new folder',
    leading: './src/assets/icons/create.svg',
    action: () => alert('New folder added!'),
    shortcuts: ['⌘', 'F']
  },
  {
    id: 'hashtag1',
    label: 'Add hashtag',
    leading: './src/assets/icons/create.svg',
    action: () => alert('Hashtag added!'),
    shortcuts: ['⌘', 'H']
  },
  {
    id: 'label1',
    label: 'Add label',
    leading: './src/assets/icons/create.svg',
    action: () => alert('Label added!'),
    shortcuts: ['⌘', 'L']
  },
  {
    id: 'new-file2',
    label: 'Add new file',
    leading: './src/assets/icons/create.svg',
    action: () => alert('New file added'),
    shortcuts: ['⌘', 'N']
  },
  {
    id: 'new-folder2',
    label: 'Add new folder',
    leading: './src/assets/icons/create.svg',
    action: () => alert('New folder added!'),
    shortcuts: ['⌘', 'F']
  },
  {
    id: 'hashtag2',
    label: 'Add hashtag',
    leading: './src/assets/icons/create.svg',
    action: () => alert('Hashtag added!'),
    shortcuts: ['⌘', 'H']
  },
  {
    id: 'label2',
    label: 'Add label',
    leading: './src/assets/icons/create.svg',
    action: () => alert('Label added!'),
    shortcuts: ['⌘', 'L']
  }
]

const groups = computed(() =>
  [
    {
      key: 'actions2',
      label: 'Actions',
      commands: actions2
    },
    {
      key: 'actions',
      label: 'Actions2',
      commands: actions
    },
    {
      key: 'users',
      label: 'Users',
      commands: users.value,
      search: async (q) => {
        if (!q) {
          return []
        }
        const { data } = await useFetch(`https://jsonplaceholder.typicode.com/users?q=${q}`, {
          beforeFetch(ctx) {
            loading.value = true
            return ctx
          }
        }).json()
        loading.value = false
        return data.value.map((user: Record<string, any>) =>
          useDefineCommand({
            id: user.id.toString(),
            leading: './src/assets/icons/user.svg',
            label: user.name,
            action: () => {
              // Define your action here.
            }
          })
        )
      }
    }
  ].filter(Boolean)
)

// async function handleSearch(search: string) {
//   searchTerm.value = search
//
//   const { data } = await useFetch(
//     `https://jsonplaceholder.typicode.com/users?name=${searchTerm.value}`,
//     {
//       beforeFetch(ctx) {
//         loading.value = true
//         useUnregisterCommands(asyncItems.value.map((item) => item.id))
//         return ctx
//       }
//     }
//   ).json()
//
//   if (data.value.length === 0) {
//     loading.value = false
//     return
//   }
//
//   asyncItems.value = transformUserDataToCommand(data.value)
//   useRegisterCommands(asyncItems.value, true)
//   loading.value = false
// }

whenever(cmdK, () => {
  visibility.value = !visibility.value
})

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <CmdBar :commands="groups">
    <CmdBar.Dialog :visible="visibility">
      <template #header>
        <div>
          <CmdBar.Input :placeholder="'search fo anything'" :icon="'../assets/icons/search.svg'">
            <template #leading>
              <img src="./assets/icons/search.svg" alt="search" />
            </template>
            <template #clear> x </template>
          </CmdBar.Input>
        </div>
        <CmdBar.Filter :default-filter-option="'all'" :auto-filter="true" />
      </template>
      <template #content>
        <CmdBar.List v-if="!loading" v-slot="{ command }" :config="listConfig">
          <div class="custom-item__leading">
            <img :src="command.leading" alt="icon" />
            {{ command.label }}
          </div>
          <span v-if="command.shortcuts?.length" class="custom-item__actions">
            <kbd v-for="shortcut of command.shortcuts" :key="shortcut">{{ shortcut }}</kbd>
          </span>
        </CmdBar.List>
        <CmdBar.Loading :count="6" v-else />
        <!--        <CmdBar.Empty> No results found </CmdBar.Empty>-->
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
