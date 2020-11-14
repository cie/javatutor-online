require('@babel/register')
require('array-flat-polyfill')
global.globalThis = global
const { safeLoad } = require('js-yaml')
const assert = require('assert').strict
const Ajv = require('ajv')
const fs = require('fs')
const getHints = require('../server/getHints').default
const run = require('../server/run').default

const schema = JSON.parse(
  fs.readFileSync(__dirname + '/../tasks.schema.json').toString()
)
const tasks = safeLoad(fs.readFileSync(__dirname + '/../imports/tasks.yml'))

describe('tasks', () => {
  it('tasks file is valid', () => {
    const valid = new Ajv().validate(schema, tasks)
    if (!valid) throw new Error('tasks file is not valid.')
  })
  describe('gives good hints', () => {
    for (const task of tasks) {
      describe(task.title, () => {
        for (const [testName, test] of Object.entries(task.tests || {})) {
          it(testName, async () => {
            const { code, hints: expectedHints } = test
            const hints = await getHints(code, task.id)
            assert.deepEqual(
              hints.map(({ message }) => ({ message })).slice(0, 1),
              expectedHints
            )
          })
        }
        let code = task.initialCode
        ;(task.hints || []).forEach((hint, i) => {
          if (!hint.solution) return
          const oldCode = code
          const { turn, into } = hint.solution
          const newCode = (code = oldCode.replace(turn, into))

          const { message } = hint

          it(message, async () => {
            if (!~oldCode.indexOf(turn)) {
              throw new Error(`Cannot find '${turn}' in code:\n${code}`)
            }
            const hintsBefore = await getHints(oldCode, task.id)
            assert.equal(hintsBefore[0] && hintsBefore[0].message, message)
            const hintsAfter = await getHints(newCode, task.id)
            assert.notEqual(hintsAfter[0] && hintsAfter[0].message, message)

            if (hint.solution.next) {
              assert.equal(
                hintsAfter[0] && hintsAfter[0].message,
                task.hints[i + hint.solution.next].message
              )
            }
          })

          if (hint.solution.done) {
            it('runs', async () => {
              const output = await run({
                code,
                input: task.input,
                student_id: 'test'
              })
              assert.equal(output.trim(), task.expectedOutput.trim())
            })
          }
        })
      })
    }
  })
})
