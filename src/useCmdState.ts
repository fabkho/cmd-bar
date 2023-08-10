import { reactive } from 'vue'

type State = {
  selectedItem: string
  searchTerm: string
  items: string[]
  filteredItems: string[]
}

const state = reactive<State>({
  selectedItem: '',
  searchTerm: '',
  items: [],
  filteredItems: []
})

export default {
  state: state
}
