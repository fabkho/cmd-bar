import { defineNuxtModule, isNuxt2, addComponent } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'cmd-bar',
    configKey: 'cmdBar',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, nuxt) {
    nuxt.hook('modules:done', () => {
      if (isNuxt2()) {
        throw new Error('CmdBar module is not compatible with Nuxt 2')
      } else {
        console.log('CmdBar module is compatible with Nuxt 3')
        addComponent({
          name: 'CmdBar',
          export: 'CmdBar',
          filePath: 'cmd-bar'
        })
      }
    })
  }
})
