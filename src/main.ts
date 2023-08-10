import './assets/anny-base.scss'
import { createApp } from 'vue'
import App from './App.vue'
import store, { USE_CMD_STATE } from '@/useCmdState'

const app = createApp(App)

app.provide(USE_CMD_STATE, store)
app.mount('#app')
