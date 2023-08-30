# CmdBarVue

![screenshot of commandbar](./screenshot.png)



## Features

## Usage

### CmdBar
The `CmdBar` component is the main component of this library. It is used to display the command bar. It takes the following props:
- `commands`: An array of `Command` objects. (See [Commands](#commands))
- `visible`: Whether the command bar is visible or not. (Default: `false`)

And it takes 3 slots: `header`, `content` and `footer`.

Additionally, it exposes a `toogleCmdBar` method to toggle the visibility of the command bar. In combination with [useMagicKeys](https://vueuse.org/core/useMagicKeys/#usemagickeys), it can be used like this:
``` vue
import type { Commands } from '@/types'
import { useMagicKeys, whenever } from '@vueuse/core'

const cmdBar = ref<typeof CmdBar | null>(null)
const keys = useMagicKeys()
const cmdK = keys['Meta+k']

whenever(cmdK, () => {
  if (cmdBar.value) {
    cmdBar.value.toggleCmdBar()
  }
})
```



### CmdBarInput

### CmdBarList
To ensure great performance and scalability, the `CmdBarList` component uses [useVirtualList](https://vueuse.org/core/useVirtualList/#usevirtuallist) under the hood, to render a virtualized list of commands. To work properly, it needs the **exact height** of a single item in the list. This has to be passed via the `itemHeight` prop.

## Misc

### Commands
To add commands to the command bar, you can pass an array of `Command` objects to the component. A `Command` object has the following properties:
- `id`: The id of the command. This is used to identify the command when the user selects it. (This is made unique internally, so don't worry about that.)
- `leading`: The leading icon of the command. This is displayed in the command bar.
- `title`: The title of the command.
- `category`: The category of the command. This can be used to group and filter commands in the command bar.
- `description`: The description of the command.
- `action`: The action of the command. This is called when the user selects the command.

Here is an example:
``` js
const commands = [
  {
    id: 'command1',
    leading: 'mdi-home',
    title: 'Home',
    category: 'Navigation',
    description: 'Navigate to the home page',
    action: () => {
      console.log('Navigate to the home page')
    }
  },
  {
    id: 'command2',
    leading: 'mdi-account',
    title: 'Profile',
    category: 'Navigation',
    description: 'Navigate to the profile page',
    action: () => {
      console.log('Navigate to the profile page')
    }
  }
]
```
**Tip**: You can use the `Command` type to get autocompletion for the command object.

### Keybindings
You can pass a keybinding object to the component to add keybindings to the command bar. The keybinding object has to be of type `Keybindings` (string must be in lowercase). Here is an example:
``` vue
<CmdBarVue :keybindings="{ arrowUp: 'arrowup', arrowDown: 'arrowdown', enter: 'enter' }" />
```
**Tip**: You can use the `Keybindings` type to get autocompletion for the keybindings object.

