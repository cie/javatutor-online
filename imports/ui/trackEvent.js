export default function trackEvent(opts) {
  Meteor.call('event', {
    ...opts,
    task_id: localStorage.getItem('task_id'),
    student_id: localStorage.getItem('student_id')
  })
}
