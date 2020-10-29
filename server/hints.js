import getHints, { getSrcML } from './getHints'

Meteor.methods({
  async getHint(source, task_id) {
    try {
      return (await getHints(source, task_id))[0]
    } catch (e) {
      console.error(e)
      return null
    }
  },
  getSrcML
})
