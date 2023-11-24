# cmd-bar

## 0.7.7

### Patch Changes

- - 🐞 Bug fixes
    - Teleport is not needed for preview slot

## 0.7.6

### Patch Changes

- 🐞 Bug fixes
  - outbreak has to be outside of scroll container

## 0.7.5

### Patch Changes

- 🚀 Features
  - moved slot into right context inside group component

## 0.7.4

### Patch Changes

- - 🚀 Features
    - added additional slot to List component

## 0.7.3

### Patch Changes

- 🐞 Bug fixes
  - initialize selected command event in store

## 0.7.2

### Patch Changes

- 🐞 Bug fixes - `defineSlots()` causes an TypeScript error, removed for now

## 0.7.1

### Patch Changes

- 🐞 Bug fixes - `defineSlots()` causes an TypeScript error, removed for now

## 0.7.0

### Minor Changes

- - 🚀 Features

    - introduced mitt as event bus, to give more control over events
    - new events:
      - selected
      - clicked

  - 🧹 chore
    - clean up of Input component

## 0.6.2

### Patch Changes

- 🚀 Features

  - commands property of groups is now optional to allow for groups that only fetch their commands asynchronously

  🐞 Bug fixes

  - removed logs
  - leading property of command can now be aan array

## 0.6.1

### Patch Changes

- 🧹 fix:
  - ResizeObserver is not defined on SSR

## 0.6.0

### Minor Changes

- ✨ feature:

  - updated filter component with the possibility to use an indicator

  🧹 bugs:

  - useKeymap now uses the correct types

## 0.5.0

### Minor Changes

- ### CmdBarList

  - emit selected event up to parent
  - allow different item heights per group

  ## nuxt module

  - cleanup

  ## misc

  - renamed useDefineCommand to defineCommand
  - cleanup
  - style improvements
  - type improvements

## 0.4.0

### Minor Changes

- - nuxt-module support 🎉

## 0.3.1

### Patch Changes

- export useKeymap composable

## 0.3.0

### Minor Changes

- Improved accessibility of Filter component

## 0.2.5

### Patch Changes

- problem with lockfile

## 0.2.4

### Patch Changes

- added node-linker=hoisted

## 0.2.3

### Patch Changes

- removed .npmrc

## 0.2.2

### Patch Changes

- problem with lockfile

## 0.2.1

### Patch Changes

- problem with lockfile

## 0.2.0

### Minor Changes

- asynch and fuzzy search support

## 0.1.0

### Minor Changes

- 2ac811c: added changeset
