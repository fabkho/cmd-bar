import CmdBar from './components/CmdBar.vue'
import CmdBarInput from './components/CmdBarInput.vue'
import CmdBarList from './components/CmdBarList.vue'
import CmdBarFilter from './components/CmdBarFilter.vue'
import CmdBarDialog from './components/CmdBarDialog.vue'
import { defineCommand } from './composables/useDefineCommand'
import { useCmdBarEvent } from './composables/useCmdBarEvent'
import { useKeymap } from './composables/useKeymap'

const components = Object.assign(CmdBar, {
  Input: CmdBarInput,
  List: CmdBarList,
  Filter: CmdBarFilter,
  Dialog: CmdBarDialog,
  Root: CmdBar
})

export { defineCommand, useKeymap, useCmdBarEvent }
export * from './types'
export { components as CmdBar }
