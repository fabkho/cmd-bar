import CmdBar from './components/CmdBar.vue'
import CmdBarInput from './components/CmdBarInput.vue'
import CmdBarList from '@/components/CmdBarList.vue'
import CmdBarFilter from './components/CmdBarFilter.vue'
import CmdBarDialog from './components/CmdBarDialog.vue'
import { computed, defineComponent, h } from 'vue'
import { useCmdBarState } from '@/useCmdBarState'

/**
 * Command Empty Node
 */
const Empty = defineComponent({
  name: 'Command.Empty',
  setup(props, { attrs, slots }) {
    const hasResults = computed(() => useCmdBarState.state.filteredGroupedCommands.length === 0)
    return () =>
      hasResults.value
        ? h(
            'div',
            {
              class: 'empty',
              role: 'presentation',
              ...attrs
            },
            slots
          )
        : h('div', {
            role: 'presentation',
            class: 'empty',
            style: {
              display: 'none'
            },
            ...attrs
          })
  }
})

/**
 * Command Loading Node
 */
const Loading = defineComponent({
  name: 'Command.Loading',
  props: {
    count: {
      type: Number
    }
  },
  setup(props, { slots }) {
    return () => {
      const loadingComponents = []
      const count = props.count ?? 1

      for (let i = 0; i < count; i++) {
        loadingComponents.push(
          h(
            'div',
            {
              class: 'skeleton',
              role: 'progressbar'
            },
            slots
          )
        )
      }

      return loadingComponents
    }
  }
})
//
// /**
//  * Command Separator Node
//  */
// const Separator = defineComponent({
//   name: 'Command.Separator',
//   setup(props, { attrs, slots }) {
//     return () =>
//       h('div', {
//         'command-separator': '',
//         role: 'separator',
//         ...attrs
//       })
//   }
// })

const components = Object.assign(CmdBar, {
  Input: CmdBarInput,
  List: CmdBarList,
  Filter: CmdBarFilter,
  Dialog: CmdBarDialog,
  Loading,
  Empty,
  // Loading,
  // Separator,
  Root: CmdBar
})

export { components as CmdBar }
