if (typeof describe !== 'undefined') {
  const { safeLoad } = require('js-yaml')
  const { readFileSync } = require('fs')
  module.exports = safeLoad(
    readFileSync(__dirname + '/../imports/tasks.yml').toString()
  )
} else {
  module.exports = require('../imports/tasks.yml')
}
