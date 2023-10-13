import { ref, onMounted, onBeforeUnmount } from 'vue'

type KeyAction = () => void

type Keymap = Record<string, { action: KeyAction; override?: boolean }>

function createKeymap(initialKeymap: Keymap = {}) {
  const keymap = ref<Keymap>(initialKeymap)

  const addKeyBinding = (key: string, action: KeyAction, override = true) => {
    if (override || !keymap.value[key] || keymap.value[key].override) {
      keymap.value[key] = { action, override }
    }
  }

  const removeKeyBinding = (key: string) => {
    delete keymap.value[key]
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

  return {
    addKeyBinding,
    removeKeyBinding
  }
}

export function useKeymap(initialKeymap: Keymap = {}) {
  return createKeymap(initialKeymap)
}
