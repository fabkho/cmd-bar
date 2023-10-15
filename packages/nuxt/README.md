<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: cmd-bar
- Package name: cmd-bar
- Description: Nuxt-module wrapper for cmd-bar
-->

# cmd-bar

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt-module wrapper for cmd-bar vue 3 component.

- [✨ &nbsp;Release Notes](../../CHANGELOG.md)

[//]: # (- [📖 &nbsp;Documentation]&#40;https://example.com&#41;)

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

2. Add `cmd-bar` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'cmd-bar'
  ]
})
```

That's it! You can now use cmd-bar in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/cmd-bar/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/cmd-bar

[npm-downloads-src]: https://img.shields.io/npm/dm/cmd-bar.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/cmd-bar

[license-src]: https://img.shields.io/npm/l/cmd-bar.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/cmd-bar

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
