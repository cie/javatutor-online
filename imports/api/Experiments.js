export const Experiments = new Meteor.Collection('Experiments')

Experiments.allow({
  insert() {
    return Meteor.userId() === 'instructor'
  },
  update() {
    return Meteor.userId() === 'instructor'
  },
  remove() {
    return Meteor.userId() === 'instructor'
  }
})

if (Meteor.isServer) {
  Meteor.publish('Experiments', function () {
    if (this.userId === 'instructor') return Experiments.find()
    else return Experiments.find({ active: true })
  })
  Meteor.methods({
    getActiveExperiments() {
      return Experiments.find({ active: true }).fetch()
    }
  })
} else {
  Meteor.subscribe('Experiments')
}
