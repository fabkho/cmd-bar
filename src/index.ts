import { defineComponent, h, computed } from 'vue'
import CmdBar from './components/CmdBar.vue'
import CmdBarInput from './components/CmdBarInput.vue'
import CmdBarItems from './components/CmdBarItems.vue'

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
//
// /**
//  * Command Loading Node
//  */
// const Loading = defineComponent({
//   name: 'Command.Loading',
//   setup(props, { attrs, slots }) {
//     return () =>
//       h(
//         'div',
//         {
//           'command-loading': '',
//           role: 'progressbar',
//           ...attrs
//         },
//         slots
//       )
//   }
// })
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
  Items: CmdBarItems,
  // Loading,
  // Separator,
  Root: CmdBar
})

export { components as CmdBar }
