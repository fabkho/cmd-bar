import { defineNuxtPlugin } from '#app'
import { CmdBar } from 'cmd-bar'

export default defineNuxtPlugin(() => {
  console.log('Plugin injected by my-module!')
  return {
    provide: {
      CmdBar
    }
  }
})
