import CmdBar from './components/CmdBar.vue'
import CmdBarInput from './components/CmdBarInput.vue'
import CmdBarVirtualList from './components/CmdBarVirtualList.vue'
import CmdBarList from './components/CmdBarList.vue'
import CmdBarFilter from './components/CmdBarFilter.vue'
import CmdBarDialog from './components/CmdBarDialog.vue'
import { defineCommand } from './useDefineCommand'
import { useCmdBarEvent } from './useCmdBarEvent'
import { useKeymap } from './useKeymap'

const components = Object.assign(CmdBar, {
  Input: CmdBarInput,
  VirtualList: CmdBarVirtualList,
  List: CmdBarList,
  Filter: CmdBarFilter,
  Dialog: CmdBarDialog,
  Root: CmdBar
})

export { defineCommand, useKeymap, useCmdBarEvent }
export * from './types'
export { components as CmdBar }
