import { defineNuxtModule, isNuxt2, addImportsDir, addPlugin, createResolver } from '@nuxt/kit'

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
    const resolver = createResolver(import.meta.url)

    addImportsDir(resolver.resolve('./runtime/composables'))

    nuxt.hook('modules:done', () => {
      if (isNuxt2()) {
        throw new Error('CmdBar module is not compatible with Nuxt 2')
      } else {
        addPlugin(resolver.resolve('./runtime/plugin'))
        // addComponent({
        //   name: 'NuxtSnackbar',
        //   filePath: resolver.resolve('./runtime/components/NuxtSnackbar')
        // })
      }
    })
  }
})
