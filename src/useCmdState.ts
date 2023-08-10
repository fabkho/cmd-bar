import { type InjectionKey, reactive } from 'vue'
import type { State } from '@/types'

/**
 * key for injection
 */
export const USE_CMD_STATE: InjectionKey<State> = Symbol('useCmdState')

const state = reactive<State>({
  selectedItemIndex: 1,
  searchTerm: 'testitest',
  items: [],
  filteredItems: []
})

export default state
