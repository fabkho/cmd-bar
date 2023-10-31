import { useCmdBarState } from './useCmdBarState'
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import { Group, NavOperations, ShortcutOptions } from './types'

type ShortcutsSetup = (nav: NavOperations) => Array<ShortcutOptions>

function createKeymap() {
  const keymap = ref<Record<string, ShortcutOptions>>({})
  const keys = useMagicKeys()

  const registerKeyBinding = (shortcut: ShortcutOptions) => {
    const { key, action, override = false, autoRepeat = false } = shortcut

    if (key.includes('+')) {
      const sh = keys[key]
      if (override || !keymap.value[key] || keymap.value[key].override) {
        whenever(sh, action)
      }
    } else {
      if (override || !keymap.value[key] || keymap.value[key].override) {
        keymap.value[key] = { key, action, autoRepeat, override }
      }
    }
  }

  // /* Register key bindings from the provided initialKeymap */
  // initialKeymap.forEach((shortcut) => {
  //   if (shortcut.key && shortcut.action) {
  //     registerKeyBinding(shortcut)
  //   }
  // })

  const removeKeyBinding = (keys: string) => {
    delete keymap.value[keys]
  }

  const handleKeydown = (event: KeyboardEvent) => {
    const binding = keymap.value[event.key]
    if (binding && binding.action) {
      if (!binding.autoRepeat && event.repeat) {
        // If autoRepeat is false and the event is a repeat, do nothing.
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
