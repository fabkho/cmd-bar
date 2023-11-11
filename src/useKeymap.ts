import { useCmdBarState } from './useCmdBarState'
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import { Group, NavOperations, ShortcutOptions } from './types'

type ShortcutsSetup = (nav: NavOperations) => Array<ShortcutOptions>

function createKeymap() {
  const keymap = ref<Array<ShortcutOptions>>([])
  const keys = useMagicKeys()

  const registerKeyBinding = (shortcut: ShortcutOptions) => {
    const { key, action, override = false, autoRepeat = false } = shortcut

    //TODO: if binding is already registered, check is override is true
    // if not, throw error
    // rename to isOverwritable
    if (key.includes('+')) {
      const sh = keys[key]
      if (override || !keymap.value.some((binding) => binding.key === key)) {
        whenever(sh, action)
      }
    } else {
      if (override || !keymap.value.some((binding) => binding.key === key)) {
        keymap.value.push({ key, action, autoRepeat, override })
      }
    }
  }

  const removeKeyBinding = (key: string) => {
    const index = keymap.value.findIndex((binding) => binding.key === key)
    if (index !== -1) {
      keymap.value.splice(index, 1)
    }
  }

  const handleKeydown = (event: KeyboardEvent) => {
    const binding = keymap.value.find((b) => b.key === event.key)
    if (binding && binding.action) {
      if (!binding.autoRepeat && event.repeat) {
        return
      }
      binding.action()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return { registerKeyBinding, removeKeyBinding, keymap }
}

export function useKeymap(fn: ShortcutsSetup) {
  const nav = {
    next: () => useCmdBarState.nextCommand(),
    prev: () => useCmdBarState.prevCommand(),
    execute: () => useCmdBarState.executeCommand()
  }

  const { registerKeyBinding } = createKeymap()
  const shortcuts = fn(nav)

  shortcuts.forEach((shortcut) => {
    if (shortcut.key) {
      registerKeyBinding(shortcut)
    }
  })

  const addKeyBindingsFromCommands = (groups: Group[]) => {
    groups.forEach((group) => {
      group.commands.forEach((command) => {
        if (command.shortcut) {
          const action = command.action
          const shortcut: ShortcutOptions = {
            key: command.shortcut,
            action
          }
          registerKeyBinding(shortcut)
        }
      })
    })
  }

  return {
    addKeyBindingsFromCommands
  }
}
