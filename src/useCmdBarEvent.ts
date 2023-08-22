import mitt, { type Emitter } from 'mitt'

type Events = {
  foo: string
  bar?: number
}

const emitter: Emitter<Events> = mitt<Events>()

const useCommandEvent = () => {
  return {
    emitter
  }
}

export { useCommandEvent }
