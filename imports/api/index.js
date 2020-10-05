import { Students } from './Students'
import { Experiments } from './Experiments'
import { Tasks } from './Tasks'

Object.assign(typeof window === 'undefined' ? global : window, {
  Experiments,
  Students,
  Tasks
})
