require('@babel/register')
const { safeLoad } = require('js-yaml')
const assert = require('assert').strict
const Ajv = require('ajv')
const fs = require('fs')
const mulang = require('mulang')
const getHints = require('../imports/api/getHints').default

const schema = JSON.parse(
  fs.readFileSync(__dirname + '/../tasks.schema.json').toString()
)
const tasks = safeLoad(fs.readFileSync(__dirname + '/../tasks.yml'))

describe('tasks', () => {
  it('tasks file is valid', () => {
    const valid = new Ajv().validate(schema, tasks)
    if (!valid) throw new Error('tasks file is not valid.')
  })
  describe('gives good hints', () => {
    for (const task of tasks) {
      describe(task.title, () => {
        for (const [testName, test] of Object.entries(task.tests)) {
          it(testName, async () => {
            const { code, hints: expectedHints } = test
            const hints = await getHints(code, task.hints)
            assert.deepEqual(hints, expectedHints)
          })
        }
      })
    }
  })
})
