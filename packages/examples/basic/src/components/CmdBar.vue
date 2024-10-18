<script setup lang="ts">
import Skeleton from './Skeleton.vue'
import {
  type Command,
  defineCommand,
  CmdBar,
  useCmdBarEvent,
  useKeymap,
  CmdBarDialog,
  CmdBarInput,
  CmdBarFilter,
  CmdBarList
} from 'cmd-bar'
import 'cmd-bar/style.css'
import { useFetch, useMagicKeys, whenever } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

const users = ref<Command[]>([])
const products = ref<Command[]>([])
const visibility = ref(false)
const keys = useMagicKeys()
const cmdK = keys['Meta+k']
const activeCommand = ref<Command | null>(null)

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
    'https://dummyjson.com/users?limit=10&select=id,firstName,lastName'
  ).json()
  users.value = data.value.users.map((user: Record<string, any>) => {
    return defineCommand({
      key: 'user-' + user.id.toString(),
      leading: './src/assets/icons/user_new.svg',
      label: `${user.firstName} ${user.lastName}`,
      action: () => {
        // Define your action here.
      }
    })
  })
}

async function fetchProducts() {
  const { data } = await useFetch('https://dummyjson.com/products?limit=10&select=id,title').json()
  products.value = data.value.products.map((product: Record<string, any>) => {
    return defineCommand({
      key: 'product-' + product.id.toString(),
      label: `${product.title}`,
      action: () => {
        // Define your action here.
      }
    })
  })
}

const actions = [
  {
    key: 'new-resource',
    label: 'Create new Resource',
    leading: './src/assets/icons/create.svg',
    action: () => alert('New Resource created'),
    shortcut: 'Ctrl+R'
  },
  {
    key: 'new-service',
    label: 'Add new Service',
    leading: './src/assets/icons/service_1.svg',
    action: () => alert('New Service added'),
    shortcut: 'Ctrl+S'
  },
  {
    key: 'open-settings',
    label: 'Open settings',
    leading: './src/assets/icons/settings.svg',
    action: () => alert('Settings opened'),
    shortcut: 'Ctrl+,'
  },
  {
    key: 'open-calendar',
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
        const { data } = await useFetch(`https://dummyjson.com/users/search?q=${q}`, {}).json()
        return data.value.users.map((user: Record<string, any>) =>
          defineCommand({
            key: 'user-' + user.id.toString(),
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
        const { data } = await useFetch(`https://dummyjson.com/products/search?q=${q}`, {}).json()
        return data.value.products.map((product: Record<string, any>) =>
          defineCommand({
            key: 'product-' + product.id.toString(),
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
  console.log("🚀 ~ emitter.on ~ command:", command)
  activeCommand.value = command
})

const filterOptions = [
  {
    groupKey: null,
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
    visible: true
  },
  {
    groupKey: 'products',
    label: 'Products',
    visible: true
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
    <CmdBarDialog v-model:visible="visibility">
      <template #header>
        <div>
          <CmdBarInput :placeholder="'search fo anything'">
            <template #leading>
              <img src="../assets/icons/search.svg" alt="search" />
            </template>
            <template #clear> x </template>
          </CmdBarInput>
        </div>
        <CmdBarFilter :filter-options="filterOptions" />
      </template>
      <template #content>
        <CmdBarList :loop="false" :results-header="'Results'">
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
          <template #no-results>
            <div class="no-results">No results found !!!</div>
          </template>
          <template #preview="{activeCommand}">
            <span>{{ activeCommand?.label }}</span>
          </template>
        </CmdBarList>
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
    </CmdBarDialog>
  </CmdBar>
</template>

<style lang="scss">
@import '../assets/global';
</style>
