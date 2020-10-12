import mulang from 'mulang'
import tasks from '../imports/api/tasks.yml'

Meteor.methods({
  getHint(source, task_id) {
    try {
      const task = tasks.find(t => t.id === task_id)
      let code
      code = mulang.nativeCode('Java', source)
      const edl = task.hints
        .map(
          ({ hint, spec }) =>
            `expectation ${JSON.stringify(hint)}:\n   ${spec};\n`
        )
        .join('\n')
      console.log(edl)
      const results = code.customExpect(edl)
      console.log(results)
      const firstMatchingHint = results.find(([hint, matches]) => matches)
      console.log(firstMatchingHint)
      if (firstMatchingHint) return firstMatchingHint[0]
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
