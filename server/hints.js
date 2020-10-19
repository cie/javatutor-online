import mulang from 'mulang'
import tasks from '../imports/../private/tasks.yml'
import getHints from './getHints'

Meteor.methods({
  getHint(source, task_id) {
    try {
      return getHints(source, task_id)[0]
    } catch (e) {
      console.error(e)
      return null
    }
  },
  getAST(source) {
    const code = mulang.nativeCode('Java', source)
    return code.ast
  }
})
