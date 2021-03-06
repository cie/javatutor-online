import { Students } from './Students'
import { Experiments } from './Experiments'
import { Tasks } from './Tasks'
import { Events } from './Events'
import { Messages } from './Messages'
import './Help'

Object.assign(typeof window === 'undefined' ? global : window, {
  Experiments,
  Students,
  Tasks,
  Events,
  Messages
})
