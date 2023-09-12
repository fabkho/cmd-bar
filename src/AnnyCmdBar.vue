<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { CmdBar } from './index'
import type { Command, Commands } from '@/types'
import { useFetch, useMagicKeys, whenever } from '@vueuse/core'
import { useDefineCommand } from '@/useDefineCommand'

const cmdBar = ref<typeof CmdBar | null>(null)
const asyncItems = ref<Commands>([])
let loading = ref(false)
const visibility = ref(false)
const keys = useMagicKeys()
const cmdK = keys['Meta+k']
const searchTerm = ref('')

async function fetchCommands() {
  const { data } = await useFetch('https://jsonplaceholder.typicode.com/users', {
    beforeFetch(ctx) {
      loading.value = true
      return ctx
    }
  }).json()
  asyncItems.value = data.value.map((user: Record<string, any>) =>
    useDefineCommand({
      id: user.id.toString(),
      leading: './src/assets/icons/user.svg',
      label: user.name,
      action: () => {
        // Define your action here.
      }
    })
  )
  loading.value = false
}

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

const filterOptions = computed(() => groups.value.map((group) => group.label))
const defaultFilterOption = computed(() => filterOptions.value[0])

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
  console.log('visibility', visibility.value)
})

onMounted(() => {
  fetchCommands()
})
</script>

<template>
  <CmdBar :commands="groups">
    <CmdBar.Dialog :visible="visibility">
      <template #header>
        <CmdBar.Input :placeholder="'search fo anything'" :icon="'../assets/icons/search.svg'" />
        <CmdBar.Filter :default-filter-option="'all'" :auto-filter="true" />
      </template>
      <template #content>
        <CmdBar.List
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
