import { Meteor } from 'meteor/meteor'
import '../imports/api'
import fs from 'fs'
import child_process from 'child_process'

Meteor.startup(() => {
  Meteor.users.upsert('instructor', { username: 'instructor' })
  Accounts.setPassword(
    'instructor',
    Meteor.settings.instructorPassword || 'thisisnotatest'
  )
})

Meteor.methods({
  reauthenticate({ student_id }) {
    this.setUserId(student_id)
  },
  startSession({ nickname, experiment_id }) {
    const student_id = Students.insert({
      nickname,
      experiment_id
    })
    this.setUserId(student_id)
    return student_id
  },
  run(javaCode) {
    console.log({ javaCode })
    fs.writeFileSync('Code.java', javaCode)
    console.log('wrote', process.cwd())
    try {
      child_process.execSync('javac Code.java')
    } catch (e) {
      return e.message
    }
    const result = child_process.execSync('java Code').toString()
    console.log(result)
    return result
  }
})
