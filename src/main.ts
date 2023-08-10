import './assets/anny-base.scss'
import { createApp } from 'vue'
import App from './App.vue'
import useCmdState, { USE_CMD_STATE } from '@/useCmdState'
import type { InjectionKey } from 'vue-demi'
import type { State } from '@/types'
// import CmdBarVue from '@/plugins/CmdBarVue'

const app = createApp(App)

// app.use(CmdBarVue, {})
app.provide(USE_CMD_STATE, useCmdState)

app.mount('#app')
