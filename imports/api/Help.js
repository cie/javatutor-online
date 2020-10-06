const { Students } = require('./Students')

Meteor.methods({
  askForHelp({ student_id, task_id }) {
    Students.update(student_id, {
      $set: { helpAsked: true, helpTaskId: task_id }
    })
  },
  cancelHelp({ student_id }) {
    Students.update(student_id, {
      $set: { helpAsked: false, problemMessage: null, helpTaskId: null }
    })
  },
  sendProblemMessage({ student_id, task_id, problemMessage }) {
    Students.update(student_id, {
      $set: { helpAsked: true, helpTaskId: task_id, problemMessage }
    })
  }
})
