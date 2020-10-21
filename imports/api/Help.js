const { Students } = require('./Students')

if (Meteor.isServer) {
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
    },
    sendAnswer({ student_id, task_id, answer }) {
      if (this.userId !== 'instructor') throw new Meteor.Error(403)
      Students.update(student_id, {
        $set: { helpAsked: false, answerTaskId: task_id, answer }
      })
    }
  })
}
