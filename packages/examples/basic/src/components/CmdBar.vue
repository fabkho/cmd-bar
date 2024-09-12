<script setup lang="ts">
import Skeleton from './Skeleton.vue'
import { type Command, defineCommand, CmdBar, useCmdBarEvent, useKeymap } from 'cmd-bar'
import { useFetch, useMagicKeys, whenever } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

const users = ref<Command[]>([])
const products = ref<Command[]>([])
const visibility = ref(false)
const keys = useMagicKeys()
const cmdK = keys['Meta+k']
const activeCommand = ref<Command | null>(null)

const listConfig = {
  itemHeightInPixel: {
    actions: 48,
    users: 48,
    products: 48
  },
  containerHeight: '21rem',
  groupLabelHeightInPixel: 20
}

useKeymap((nav) => {
  return [
    {
      key: 'ArrowRight',
      action: () => nav.prev(),
      autoRepeat: false
    },
    {
      key: 'ArrowLeft',
      action: () => nav.next(),
      autoRepeat: false
    }
  ]
})

const formatShortcut = (shortcutString: string) => {
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
    return defineCommand({
      id: user.id.toString(),
      //
      leading: './src/assets/icons/user_new.svg',
      label: `${user.firstName} ${user.lastName}`,
      action: () => {
        // Define your action here.
      }
    })
  })
}

async function fetchProducts() {
  const { data } = await useFetch('https://dummyjson.com/products?limit=10&select=id,title', {
    beforeFetch(ctx) {
      return ctx
    }
  }).json()
  products.value = data.value.products.map((product: Record<string, any>) => {
    return defineCommand({
      id: product.id.toString(),
      label: `${product.title}`,
      action: () => {
        // Define your action here.
      }
    })
  })
}

const actions = [
  {
    id: 'new-resource',
    label: 'Create new Resource',
    leading: './src/assets/icons/create.svg',
    action: () => alert('New Resource created'),
    shortcut: 'Ctrl+R'
  },
  {
    id: 'new-service',
    label: 'Add new Service',
    leading: './src/assets/icons/service_1.svg',
    action: () => alert('New Service added'),
    shortcut: 'Ctrl+S'
  },
  {
    id: 'open-settings',
    label: 'Open settings',
    leading: './src/assets/icons/settings.svg',
    action: () => alert('Settings opened'),
    shortcut: 'Ctrl+,'
  },
  {
    id: 'open-calendar',
    label: 'Open calendar',
    leading: './src/assets/icons/calendar.svg',
    action: () => alert('Calendar opened'),
    shortcut: 'Ctrl+C'
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
        const { data } = await useFetch(`https://dummyjson.com/users/search?q=${q}`, {}).json()
        return data.value.users.map((user: Record<string, any>) =>
          defineCommand({
            id: user.id.toString(),
            label: `${user.firstName} ${user.lastName}`,
            action: () => {
              // Define your action here.
            }
          })
        )
      }
    },
    {
      key: 'products',
      label: 'Products',
      commands: products.value,
      search: async (q: string) => {
        if (!q) {
          return []
        }
        const { data } = await useFetch(`https://dummyjson.com/products/search?q=${q}`, {}).json()
        return data.value.products.map((product: Record<string, any>) =>
          defineCommand({
            id: product.id.toString(),
            label: `${product.title}`,
            action: () => {
              // Define your action here.
            }
          })
        )
      }
    }
  ].filter(Boolean)
)

const { emitter } = useCmdBarEvent()

emitter.on('selected', (command) => {
  console.log('=>(CmdBar.vue:185) command', command)
  activeCommand.value = command
})

const fuseOptions = {
  fuseOptions: {
    keys: ['label']
  }
}
const filterOptions = [
  {
    groupKey: 'default',
    label: 'All',
    visible: true
  },
  {
    groupKey: 'actions',
    label: 'Actions',
    visible: true
  },
  {
    groupKey: 'users',
    label: 'Users',
    visible: false
  }
]

whenever(cmdK, () => {
  visibility.value = !visibility.value
})

onMounted(() => {
  fetchUsers()
  fetchProducts()
})
</script>

<template>
  <CmdBar :commands="groups">
    <CmdBar.Dialog :visible="visibility">
      <template #header>
        <div>
          <CmdBar.Input :placeholder="'search fo anything'" :fuse="fuseOptions">
            <template #leading>
              <img src="../assets/icons/search.svg" alt="search" />
            </template>
            <template #clear> x </template>
          </CmdBar.Input>
        </div>
        <CmdBar.Filter :filter-options="filterOptions" />
      </template>
      <template #content>
        <CmdBar.VirtualList :config="listConfig">
          <template #default="{ command }">
            <div class="leading">
              {{ command.label }}
            </div>
            <span v-if="command.shortcut" class="actions">
              <kbd v-for="shortcut of formatShortcut(command.shortcut)" :key="shortcut">{{
                shortcut
              }}</kbd>
            </span>
          </template>
          <template #loading>
            <Skeleton v-for="index in 5" :key="index" />
          </template>
        </CmdBar.VirtualList>
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
