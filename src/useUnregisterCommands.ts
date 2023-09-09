import type { MaybeRef } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'

/**
 * Unregister commands in the global state
 * @param commandIds
 */
export function useUnregisterCommands(commandIds: string[]): void {
  useCmdBarState?.unregisterCommands(commandIds)
}
