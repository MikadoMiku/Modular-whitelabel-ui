import mitt from 'mitt'

type EmitterEvents = {
  'component-chosen': string
}

const modularityEmitter = mitt<EmitterEvents>()

export default modularityEmitter
