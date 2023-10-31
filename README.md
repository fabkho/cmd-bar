# CmdBarVue WIP

![Preview](public/cmd-bar.gif)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Vue][vue-src]][vue-href]

## Features

- 🎨&nbsp; **Unstyled** - No styles included, you can style it as you want
- 🧩&nbsp; **Extensible** - You can add your own Modal and components
- ⌨️&nbsp; **Key bindings** - Usable with just a keyboard
- 🧙‍&nbsp; **Virtualized** - It uses [useVirtualList](https://vueuse.org/core/useVirtualList/#usevirtuallist)

[📖 &nbsp;Read more](https://cmd-bar.nuxt.space)

## Quick Setup

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
```ts
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

[📖 &nbsp;Read more](https://cmd-bar.nuxt.space/introduction/getting-started)

Props to [xiaoluoboding/vue-command-palette](https://github.com/xiaoluoboding/vue-command-palette)  and [CommandPalette - Nuxt UI](https://ui.nuxt.com/navigation/command-palette), for the inspiration.

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/cmd-bar/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/cmd-bar

[npm-downloads-src]: https://img.shields.io/npm/dm/cmd-bar.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/cmd-bar

[license-src]: https://img.shields.io/npm/l/cmd-bar.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/cmd-bar

[vue-src]: https://img.shields.io/badge/Vue-18181B?&logo=vue.js
[vue-href]: https://vuejs.org



