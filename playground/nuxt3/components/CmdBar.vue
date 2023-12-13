<script setup lang="ts">
import CmdBarCustomerPeak from '~/components/peaks/CmdBarUserPeak.vue'
import Skeleton from './Skeleton.vue'
import { type Command, defineCommand, CmdBar } from '@cmd-bar/src'
import { useCmdBarEvent } from '@cmd-bar/src/useCmdBarEvent'
import { useKeymap } from '@cmd-bar/src/useKeymap'
import { useFetch, useMagicKeys, whenever } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

const users = ref<Command[]>([])
const visibility = ref(false)
const keys = useMagicKeys()
const cmdK = keys['Meta+k']
const activeCommand = ref<Command | null>(null)

const listConfig = {
  itemHeightInPixel: {
    actions: 48,
    users: 48
  },
  containerHeight: '26rem',
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
    'https://dummyjson.com/users?limit=50&select=id,firstName,lastName',
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
      leading: 'ic:baseline-person',
      label: `${user.firstName} ${user.lastName}`,
      action: () => {
        // Define your action here.
      }
    })
  })
}

function toggleColorTheme() {
  const html = document.querySelector('html')
  if (html?.classList.contains('dark')) {
    html.classList.remove('dark')
  } else {
    html?.classList.add('dark')
  }
}

const actions = [
  {
    id: 'toggle-theme',
    label: 'Toggle color theme',
    leading: 'ic:baseline-settings',
    action: () => toggleColorTheme(),
    shortcut: 'Ctrl+R'
  },
  {
    id: 'new-resource',
    label: 'Create new Resource',
    leading: 'ic:baseline-add-box',
    action: () => alert('New Resource created'),
    shortcut: 'Ctrl+R'
  },
  {
    id: 'new-service',
    label: 'Add new Service',
    leading: 'ic:baseline-add-box',
    action: () => alert('New Service added'),
    shortcut: 'Ctrl+S'
  },
  {
    id: 'open-settings',
    label: 'Open settings',
    leading: 'ic:baseline-settings',
    action: () => alert('Settings opened'),
    shortcut: 'Ctrl+,'
  },
  {
    id: 'open-calendar',
    label: 'Open calendar',
    leading: 'ic:outline-calendar-month',
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
            leading: './src/assets/icons/user_new.svg',
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

const { emitter } = useCmdBarEvent()

emitter.on('selected', (command) => {
  console.log('selected', command)
  activeCommand.value = command
})

const fuseOptions = {
  fuseOptions: {
    keys: ['label']
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
          <CmdBar.Input :placeholder="'search fo anything'" :fuse="fuseOptions">
            <template #leading>
              <Icon name="ic:baseline-search" size="26px" />
            </template>
            <template #clear> x </template>
          </CmdBar.Input>
        </div>
        <CmdBar.Filter :default-filter-option="'all'" :auto-filter="true" />
      </template>
      <template #content>
        <CmdBar.VirtualList :config="listConfig" v-if="activeCommand">
          <template #default="{ command }">
            <div class="leading">
              <div class="icon-container">
                <Icon :name="command.leading" size="18px" />
              </div>
              {{ command.label }}
            </div>
            <span v-if="command.shortcut" class="actions">
              <kbd v-for="shortcut of formatShortcut(command.shortcut)" :key="shortcut">{{
                shortcut
              }}</kbd>
            </span>
          </template>
          <template #preview="{ command }">
            <CmdBarCustomerPeak :command="command" />
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
@import '../assets/cmd-bar';
</style>
