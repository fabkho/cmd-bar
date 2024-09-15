import { useCmdBarState } from './useCmdBarState'
import { ref, onBeforeUnmount, onMounted, Ref } from 'vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import { Command, Group, NavOperations, ShortcutOptions } from '../types'

type ShortcutsSetup = (nav: NavOperations) => Array<ShortcutOptions>

const singleKeyShortcuts = ref<Array<ShortcutOptions>>([])
const isActive = ref<boolean>(false) // State to track if the command bar is active

function createKeymap() {
  const keys = useMagicKeys()

  const registerKeyBinding = (shortcut: ShortcutOptions) => {
    const { key, action, autoRepeat = false } = shortcut

    // Handle shortcuts with multiple keys (e.g. 'Ctrl+Shift+P')
    if (key.includes('+')) {
      const multiKeyShortcut = keys[key]
      if (multiKeyShortcut && !singleKeyShortcuts.value.some((binding) => binding.key === key)) {
        whenever(multiKeyShortcut, () => {
          if (isActive.value) {
            action()
          }
        })
      }
    }
    // Handle single key shortcuts (e.g. 'Enter'), with support for autoRepeat
    else {
      if (!singleKeyShortcuts.value.some((binding) => binding.key === key)) {
        singleKeyShortcuts.value.push({ key, action, autoRepeat })
      }
    }
  }

  const removeKeyBinding = (key: string) => {
    const index = singleKeyShortcuts.value.findIndex((binding) => binding.key === key)
    if (index !== -1) {
      singleKeyShortcuts.value.splice(index, 1)
    }
  }

  const handleKeydown = (event: KeyboardEvent) => {
    const binding = singleKeyShortcuts.value.find((b) => b.key === event.key)
    if (binding && isActive.value && binding.action) {
      if (!binding.autoRepeat && event.repeat) {
        return
      }
      binding.action()
    }
  }

  return { registerKeyBinding, handleKeydown, removeKeyBinding, singleKeyShortcuts }
}

export function useKeymap(fn: ShortcutsSetup) {
  const nav = {
    next: () => useCmdBarState.nextCommand(),
    prev: () => useCmdBarState.prevCommand(),
    execute: () => useCmdBarState.executeCommand()
  }

  const { registerKeyBinding, handleKeydown } = createKeymap()

  const shortcuts = fn(nav)
  shortcuts.forEach((shortcut) => {
    if (shortcut.key) {
      registerKeyBinding(shortcut)
    }
  })

  const { state } = useCmdBarState
  const addKeyBindingsFromCommands = () => {
    state.commands.forEach((command) => {
      if (command.shortcut) {
        const action = command.action
        const shortcut: ShortcutOptions = {
          key: command.shortcut,
          action
        }
        registerKeyBinding(shortcut)
      }
    })
  }

  const addEventListener = () => {
    isActive.value = true
    window.addEventListener('keydown', handleKeydown)
  }

  const removeEventListener = () => {
    isActive.value = false
    window.removeEventListener('keydown', handleKeydown)
  }

  addKeyBindingsFromCommands()

  return {
    addEventListener,
    removeEventListener
  }
}
