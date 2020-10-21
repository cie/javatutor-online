import getHints from './getHints'

Meteor.methods({
  getHint(source, task_id) {
    try {
      return getHints(source, task_id)[0]
    } catch (e) {
      console.error(e)
      return null
    }
  }
})
