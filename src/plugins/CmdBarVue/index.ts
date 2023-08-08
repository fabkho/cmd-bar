import CmdBar from '@/components/CmdBar.vue'

export default {
  install(app: any, options: any) {
    app.component('CmdBar', CmdBar)
  }
}
