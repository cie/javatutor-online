import { Meteor } from 'meteor/meteor'
import '../imports/api'
import fs from 'fs'
import child_process from 'child_process'
import './languageServer'
import './hints'

Meteor.startup(() => {
  Meteor.users.upsert('instructor', { username: 'instructor' })
  Accounts.setPassword(
    'instructor',
    Meteor.settings.instructorPassword || 'thisisnotatest'
  )
})

let group = 2

console.log(5)
Meteor.methods({
  reauthenticate({ student_id }) {
    if (student_id === 'instructor') throw new Meteor.Error(403)
    this.setUserId(student_id)
  },
  startSession({ nickname, experiment_id }) {
    const student_id = Students.insert({
      nickname,
      experiment_id
    })
    this.setUserId(student_id)
    group = group === 1 ? 2 : 1
    return { student_id, group }
  },
  run(code, input) {
    const m = code.match(/public\s+class\s+(\w+)/)
    if (!m)
      throw new Error(
        'The code must contain a public class, e.g.\npublic class MyClass {\n    ...\n}'
      )
    const className = m[1]
    fs.writeFileSync(`${className}.java`, code)
    try {
      child_process.execSync(`javac ${className}.java`)
    } catch (e) {
      return e.message
    }
    fs.writeFileSync('input.txt', input)
    const result = child_process
      .execSync(`java ${className} < input.txt`)
      .toString()
    console.log(result)
    return result
  }
})
