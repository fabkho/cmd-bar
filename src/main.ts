import './assets/anny-base.scss'
import { createApp } from 'vue'
import App from './App.vue'
import useCmdState from '@/useCmdState'
import type { InjectionKey } from 'vue-demi'
import type { State } from '@/types'
// import CmdBarVue from '@/plugins/CmdBarVue'

const app = createApp(App)

// app.use(CmdBarVue, {})
const key = 'useCmdState' as InjectionKey<State>
app.provide(key, useCmdState)

app.mount('#app')
