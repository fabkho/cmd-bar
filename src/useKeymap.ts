import { ref, onBeforeUnmount, onMounted } from 'vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import { Group } from './types'

type KeyAction = () => void

type Keymap = Record<string, { action: KeyAction; override?: boolean }>

function createKeymap(initialKeymap: Keymap = {}) {
  const keymap = ref<Keymap>(initialKeymap)
  const keys = useMagicKeys()

  const registerKeyBinding = (shortcut: string, action: KeyAction, override = true) => {
    if (shortcut.includes('+')) {
      const sh = keys[shortcut]
      if (override || !keymap.value[shortcut] || keymap.value[shortcut].override) {
        whenever(sh, action)
      }
    } else {
      if (override || !keymap.value[shortcut] || keymap.value[shortcut].override) {
        keymap.value[shortcut] = { action, override }
      }
    }
  }

  // Register key bindings from the provided initialKeymap
  Object.entries(initialKeymap).forEach(([shortcut, action]) => {
    registerKeyBinding(shortcut, action.action, action?.override)
  })
  const removeKeyBinding = (keys: string) => {
    delete keymap.value[keys]
  }

  const handleKeydown = (event: KeyboardEvent) => {
    const binding = keymap.value[event.key]
    if (binding && binding.action) {
      binding.action()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return { handleKeyBinding: registerKeyBinding, removeKeyBinding, keymap }
}

export function useKeymap(initialKeymap: Keymap = {}) {
  const keymap = createKeymap(initialKeymap)

  const addKeyBindingsFromCommands = (groups: Group[]) => {
    groups.forEach((group) => {
      group.commands.forEach((command) => {
        if (command.shortcut) {
          const action = command.action
          if (action) {
            keymap.handleKeyBinding(command.shortcut, action)
          }
        }
      })
    })
  }

  return {
    ...keymap,
    addKeyBindingsFromCommands
  }
}
