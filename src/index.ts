import CmdBar from './components/CmdBar.vue'
import CmdBarInput from './components/CmdBarInput.vue'
import CmdBarList from './components/CmdBarList.vue'
import CmdBarFilter from './components/CmdBarFilter.vue'
import CmdBarDialog from './components/CmdBarDialog.vue'
import { defineComponent, h } from 'vue'

// /**
//  * Command Empty Node
//  */
// const Empty = defineComponent({
//   name: 'Command.Empty',
//   setup(props, { attrs, slots }) {
//     const { filtered } = useCommandState()
//     const isRender = computed(() => filtered.value.count === 0)
//     return () =>
//       isRender.value
//         ? h(
//             'div',
//             {
//               'command-empty': '',
//               role: 'presentation',
//               ...attrs
//             },
//             slots
//           )
//         : h('div', {
//             'command-empty': 'hidden',
//             role: 'presentation',
//             style: {
//               display: 'none'
//             },
//             ...attrs
//           })
//   }
// })

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
              'command-loading': '',
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
  // Loading,
  // Separator,
  Root: CmdBar
})

export { components as CmdBar }
