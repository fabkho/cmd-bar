<script setup lang="ts">
import { type Commands, useDefineCommand, CmdBar } from '@cmd-bar/src'
import { useKeymap } from '@cmd-bar/src/useKeymap'
import { useFetch, useMagicKeys, whenever } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import LoadingSpinner from './Spinner.vue'

const users = ref<Commands>([])
const visibility = ref(false)
const keys = useMagicKeys()
const cmdK = keys['Meta+k']

const listConfig = {
  itemHeightInPixel: 48,
  containerHeight: '21rem',
  groupLabelHeightInPixel: 20
}

useKeymap({
  ArrowUp: {
    action: () => console.log('ArrowUp'),
    override: false // Explicitly set override to false
  },
  ArrowDown: {
    action: () => console.log('ArrowDown'),
    override: false // Explicitly set override to false
  },
  Enter: {
    action: () => console.log('Enter')
  }
})

const formattedShortcuts = (shortcutString: string) => {
  // Split the string into an array based on the '+' character
  const parts = shortcutString.split('+')
  // Check which Os the user is on with useAgent
  const isMac = navigator.userAgent.includes('Mac OS')
  // Map over the parts array and replace the keys with the correct representation
  return parts.map((part) => {
    let key = part
    if (isMac) {
      key = key.replace('Ctrl', '⌃')
      key = key.replace('Alt', '⌥')
      key = key.replace('Shift', '⇧')
      key = key.replace('Meta', '⌘')
      key = key.replace('Cmd', '⌘')
    } else {
      // is Windows or Linux
      key = key.replace('Meta', 'Win')
      key = key.replace('Cmd', 'Win')
    }
    return key
  })
}

async function fetchUsers() {
  const { data } = await useFetch(
    'https://dummyjson.com/users?limit=10&select=id,firstName,lastName',
    {
      beforeFetch(ctx) {
        return ctx
      }
    }
  ).json()
  users.value = data.value.users.map((user: Record<string, any>) => {
    return useDefineCommand({
      id: user.id.toString(),
      //
      leading: './src/assets/icons/user.svg',
      label: `${user.firstName} ${user.lastName}`,
      action: () => {
        // Define your action here.
      }
    })
  })
}

const actions = [
  {
    id: 'new-file',
    label: 'Add new file',
    leading: './src/assets/icons/create.svg',
    action: () => alert('New file added'),
    shortcut: 'Ctrl+N'
  },
  {
    id: 'new-folder',
    label: 'Add new folder',
    leading: './src/assets/icons/create.svg',
    action: () => alert('New folder added!'),
    shortcut: 'Ctrl+F'
  },
  {
    id: 'hashtag',
    label: 'Add hashtag',
    leading: './src/assets/icons/create.svg',
    action: () => alert('Hashtag added!')
  },
  {
    id: 'label',
    label: 'Add label',
    leading: './src/assets/icons/create.svg',
    action: () => alert('Label added!')
  }
]

const groups = computed(() =>
  [
    {
      key: 'actions',
      label: 'Actions',
      commands: actions
    },
    {
      key: 'users',
      label: 'Users',
      commands: users.value,
      search: async (q: string) => {
        if (!q) {
          return []
        }
        const { data } = await useFetch(`https://dummyjson.com/users/search?q=${q}`, {
          beforeFetch(ctx) {
            return ctx
          }
        }).json()
        return data.value.users.map((user: Record<string, any>) =>
          useDefineCommand({
            id: user.id.toString(),
            leading: './src/assets/icons/user.svg',
            label: `${user.firstName} ${user.lastName}`,
            action: () => {
              // Define your action here.
            }
          })
        )
      }
    }
  ].filter(Boolean)
)

const fuseOptions = {
  fuseOptions: {
    keys: ['commands.label']
  }
}

whenever(cmdK, () => {
  visibility.value = !visibility.value
})

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <CmdBar :commands="groups" loop>
    <CmdBar.Dialog :visible="visibility">
      <template #header>
        <div>
          <CmdBar.Input
            :placeholder="'search fo anything'"
            :fuse="fuseOptions"
            :icon="'../assets/icons/search.svg'"
          >
            <template #leading>
              <img src="../assets/icons/search.svg" alt="search" />
            </template>
            <template #clear> x </template>
          </CmdBar.Input>
        </div>
        <CmdBar.Filter :default-filter-option="'all'" :auto-filter="true" />
      </template>
      <template #content>
        <CmdBar.List :config="listConfig">
          <template #default="{ command }">
            <div class="leading">
              <img :src="command.leading" alt="icon" />
              {{ command.label }}
            </div>
            <span v-if="command.shortcut" class="actions">
              <kbd v-for="shortcut of formattedShortcuts(command.shortcut)" :key="shortcut">{{
                shortcut
              }}</kbd>
            </span>
          </template>
          <template #loading>
            <LoadingSpinner :size="30" color="grey" />
          </template>
        </CmdBar.List>
      </template>
      <template #footer>
        <span class="trigger">
          Execute Command
          <kbd>↵</kbd>
        </span>

        <hr />
        <span class="subTrigger">
          Navigate
          <kbd>↑</kbd>
          <kbd>↓</kbd>
        </span>
      </template>
    </CmdBar.Dialog>
  </CmdBar>
</template>

<style lang="scss">
@import '../assets/anny-theme';
</style>
