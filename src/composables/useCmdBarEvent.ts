import mitt, { Emitter } from 'mitt'
import { Command } from '../types'

type Events = {
  selected: Command
  clicked: Command
  filterChange: (string | null)[]
}

const emitter: Emitter<Events> = mitt<Events>()

const useCmdBarEvent = () => {
  return {
    emitter
  }
}

export { useCmdBarEvent }
