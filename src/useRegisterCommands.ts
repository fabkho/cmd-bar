import type { Commands } from './types'
import { useCmdBarState } from '@/useCmdBarState'
import { type MaybeRef, onUnmounted, shallowRef } from 'vue'

/**
 * Register commands in the global state
 * @param commands
 * @param prepend
 */
export function useRegisterCommands(commands: MaybeRef<Commands>, prepend = false): void {
  //shallowRef https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures

  useCmdBarState?.registerCommands(shallowRef(commands).value, prepend, true)
}
