// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon'],
  alias: {
    '@cmd-bar': resolve(__dirname, '../../.')
  },
  vite: {
    resolve: {
      alias: {
        '@cmd-bar': resolve(__dirname, '../../.')
      }
    }
  }
})
