import { reactive } from 'vue'
import type { State } from '@/types'

const state = reactive<State>({
  selectedItem: '',
  searchTerm: 'testitest',
  items: [],
  filteredItems: []
})

export default state
