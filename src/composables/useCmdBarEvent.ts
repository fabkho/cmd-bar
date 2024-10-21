import mitt, { Emitter } from 'mitt'
import { Command } from '../types'

type Events = {
  selected: Command | null
  clicked: Command
  input: string
  filterChange: (string | null)[]
}

const emitter: Emitter<Events> = mitt<Events>()

const useCmdBarEvent = () => {
  return {
    emitter
  }
}

export { useCmdBarEvent }
