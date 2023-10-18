# CmdBarVue WIP

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Vue][vue-src]][vue-href]

![screenshot of commandbar](./screenshot.png)


## Features

- ⛰ &nbsp;Foo
- 🚠 &nbsp;Bar
- 🌲 &nbsp;Baz


## Setup

1. Add `cmd-bar` dependency to your project

```bash
# Using pnpm
pnpm add -D cmd-bar

# Using yarn
yarn add --dev cmd-bar

# Using npm
npm install --save-dev cmd-bar
```

2. Then you can import the `CmdBar` Compound Component in your project.
```js
import { CmdBar } from 'cmd-bar'

<CmdBar :groups="groupedCommands" />
  <CmdBar.Dialog>
    <template #header>
      <CmdBar.Input placeholder="search fo anything />
    </template>
    <template #content>
      <CmdBar.List :config="listConfig">
          <template #default="{ command }">
            <div class="leading">
              <img :src="command.leading" alt="icon" />
              {{ command.label }}
            </div>
            <span v-if="command.shortcut" class="actions">
              <kbd v-for="shortcut of formattedShortcuts(command.shortcut)" :key="shortcut">
                {{ shortcut }}
              </kbd>
            </span>
          </template>
      </CmdBar.List>
    </template>
  </CmdBar.Dialog>
</CmdBar>
```

That's it! ✨


## Documentation

### Define your commands
To define your commands, you can use the `defineCommand` composable. Which is basically just a wrapper to provide type safety. Here is an example:
``` ts
function transformUserDataToCommand(userData: Record<string, any>[]): Command[] {
  return userData.map((user: Record<string, any>) =>
    defineCommand({
      id: user.id.toString(),
      leading: './src/assets/icons/user.svg',
      title: user.name,
      groups: [], // You can set this as needed.
      description: user.email, // You can choose a relevant property for 'description'.
      action: () => {
        // Define your action here.
      },
      actionClosesCmdBar: false // You can set this as needed.
    })
  )
}
```

### CmdBar
The `CmdBar` component is the main component of this library. It is used to Provide the data to the other components. It takes the following props:
- `commands`: An array of `Command` objects. (See [Commands](#commands))
...

### CmdBar.Dialog
The `CmdBar.Dialog` component is used to display the command bar. It takes the following props:
- `visible`: Whether the command bar is visible or not. (Default: `false`)
- `loop`: Whether the command bar should loop through the commands or not. (Default: `false`)

And it takes 3 slots: `header`, `content` and `footer`.

#### Commands
To add commands to the command bar, you can pass an array of `Command` objects to the component. A `Command` object has the following properties:
- `id`: The id of the command. This is used to identify the command when the user selects it. (This is made unique internally, so don't worry about that.)
- `leading`: The leading icon of the command. This is displayed in the command bar.
- `title`: The title of the command.
- `groups`: An array of groups the command belongs to. (Default: `[]`)
- `description`: The description of the command.
- `action`: The action of the command. This is called when the user selects the command.

Here is an example:
``` js
const items: Commands = [
  {
    id: '1',
    leading: './src/assets/icons/user.svg',
    title: 'Thomas Shelby',
    action: () => {
      alert('I need a cigarette')
    },
    actionClosesCmdBar: true,
    groups: ['ALL', 'User'],
    description: 'File operations'
  },
  {
    id: '2',
    leading: './src/assets/icons/settings.svg',
    title: 'Settings',
    action: () => {
      alert('Settings action triggered!')
    },
    actionClosesCmdBar: false,
    groups: ['ALL', 'Setting'],
    description: 'Settings operations'
  }
]
```
**Tip**: You can use the `Command` type to get autocompletion for the command object.



### CmdBarInput
The `CmdBarInput` component is used to display the input field of the command bar. It takes the following props:
- `placeholder`: The placeholder of the input field. (Default: `''`)
- `modelValue`: The value of the input field. | **Optional**

**Important**: If `modelValue`prop is **not** passed, the filtering of the commands will be done automatically. Otherwise, you have to filter the commands yourself.

### CmdBarFilter
Let you define filter options for the command bar. It takes the following props:
- `filterOptions`: An array of `FilterOption` objects.
- `defaultFilterOption`: This option is preselected. If asCheckbox is enabled the other option are disabled when clicked on default option. (Default: `null`) 
- `autoFilter`: If set, the commands will be filtered automatically. (Default: `false`)
- `asCheckbox`: Whether the user can select multiple filter options or not. (Default: `false`)

#### FilterOptions
This should be a collection of all your groups that you have declared in your commands. 

#### DefaultFilterOption
This should be the group that you want to be selected by default.The behaviour of this prop is that it deselects all other `filterOptions` and selects **only** the one that you passed to the prop.
In this case (See [Commands](#commands)) I declared a group called "ALL" to all commands and I want it to be selected by default. So I pass it to the `defaultFilterOption` prop.

### CmdBarList
To ensure great performance and scalability, the `CmdBarList` component uses [useVirtualList](https://vueuse.org/core/useVirtualList/#usevirtuallist) under the hood, to render a virtualized list of commands. 
To work properly, it needs the **exact height** of a single item and the container. This has to be passed via the following props:
- `itemHeight`: The height of a single item, in **Pixel**.
- `containerHeight`: The height of the container, as a string with a unit of your choice. This is internally applied to the container, so you don't have to worry about that.

## Misc

### Styles
The CmdBar is completely headless. This means that you have to style it yourself. You can find a template, with all available classes in the `styles` folder. Or you can use the themes in the same folder.

### Keybindings
You can pass a keybinding object to the component to add keybindings to the command bar. The keybinding object has to be of type `Keybindings` (string must be in lowercase). Here is an example:
``` vue
<CmdBarVue :keybindings="{ arrowUp: 'arrowup', arrowDown: 'arrowdown', enter: 'enter' }" />
```
**Tip**: You can use the `Keybindings` type to get autocompletion for the keybindings object.



<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/cmd-bar/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/cmd-bar

[npm-downloads-src]: https://img.shields.io/npm/dm/cmd-bar.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/cmd-bar

[license-src]: https://img.shields.io/npm/l/cmd-bar.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/cmd-bar

[vue-src]: https://img.shields.io/badge/vue-3.x-4fc08d.svg?style=flat&colorA=18181B&colorB=28CF8D
[vue-href]: https://vuejs.org

