// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'
export default defineNuxtConfig({
  devtools: { enabled: true },
  // modules: ['cmd-bar'],
  vite: {
    resolve: {
      alias: {
        '@cmd-bar': resolve(__dirname, '../../.')
      }
    }
  }
})
