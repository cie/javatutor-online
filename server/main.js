import { Meteor } from 'meteor/meteor'
import '../imports/api'
import './languageServer'
import './hints'
import './run'
import { check } from 'meteor/check'
import { Students } from '../imports/api/Students'

Meteor.startup(() => {
  Meteor.users.upsert('instructor', { username: 'instructor' })
  Accounts.setPassword(
    'instructor',
    Meteor.settings.instructorPassword || 'thisisnotatest'
  )
})

const groups = ['experimental', 'control']
let group

console.log(28)
Meteor.methods({
  reauthenticate({ student_id }) {
    if (student_id === 'instructor') throw new Meteor.Error(403)
    this.setUserId(student_id)
  },
  startSession({ nickname, experiment_id }) {
    group = groups[groups.indexOf(group) + 1] || groups[0]
    const student_id = Students.insert({
      nickname,
      experiment_id,
      group
    })
    this.setUserId(student_id)
    return { student_id, group }
  },
  setTask({ student_id, task_id, input }) {
    check(student_id, String)
    check(task_id, String)
    check(input, String)
    try {
      console.log(
        'setTask,',
        [new Date().toISOString(), student_id || '', task_id || '', input || '']
          .map(JSON.stringify)
          .join(', ')
      )
    } catch {}
    Students.update(student_id, { $set: { task_id, input, highlight: null } })
  },
  setInput({ student_id, task_id, input }) {
    if (input == null) return
    check(student_id, String)
    check(task_id, String)
    check(input, String)
    try {
      console.log(
        'input',
        [new Date().toISOString(), student_id || '', task_id || '', input || '']
          .map(JSON.stringify)
          .join(', ')
      )
    } catch {}
    Students.update(student_id, { $set: { input } })
  }
})
