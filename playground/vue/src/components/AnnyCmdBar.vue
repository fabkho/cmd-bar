<script setup lang="ts">
import LoadingSpinner from '@cmd-bar/playground/vue/src/components/Spinner.vue'
import { useKeymap } from '@cmd-bar/src/useKeymap'
import { onMounted, ref, computed } from 'vue'
import { useFetch, useMagicKeys, whenever } from '@vueuse/core'
import { CmdBar, type Commands, useDefineCommand } from '@cmd-bar/src'
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
  <CmdBar :commands="groups">
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
            <span v-if="command.shortcuts?.length" class="actions">
              <kbd v-for="shortcut of command.shortcuts" :key="shortcut">{{ shortcut }}</kbd>
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
