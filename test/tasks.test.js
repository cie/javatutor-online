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
        const { hints = [] } = task
        hints.forEach((hint, i) => {
          if (!hint.solution) return
          const oldCode = hint.solution.code || code
          const { turn, into, after, add } = hint.solution
          if (
            !(
              (turn && into && !after && !add) ||
              (!turn && !into && after && add)
            )
          )
            throw new Error(
              `Either turn && into or after && add is required in ${hint.message}`
            )
          const newCode =
            turn && into
              ? oldCode.replace(turn, into)
              : oldCode.replace(after, `${after}\n${add}`)
          if (!hint.solution.code) code = newCode

          const { message } = hint

          it(message, async () => {
            if (
              (turn && !~oldCode.indexOf(turn)) ||
              (after && !~oldCode.indexOf(after))
            ) {
              throw new Error(
                `Cannot find '${turn || after}' in code:\n${code}`
              )
            }
            const hintsBefore = await getHints(oldCode, task.id)
            if (!hintsBefore[0]) fail('Did not show the hint')
            if (hintsBefore[0].message !== message) {
              const which = hints.findIndex(
                h => h.message === hintsBefore[0].message
              )
              if (which < i) fail('An earlier hint was shown')
              else if (which > i)
                fail('Did not show the hint, a later hint was shown')
              else fail('Something went wrong')
            }
            const hintsAfter = await getHints(newCode, task.id)
            if (hintsAfter[0] && hintsAfter[0].message === message)
              fail('Hint did not disappear after change')

            if (hint.solution.next) {
              if (!hintsAfter[0]) fail(`After solving, no hint was shown`)
              const which = hints.findIndex(
                h => h.message === hintsAfter[0].message
              )
              if (which !== i + hint.solution.next)
                fail(
                  `After solving, hint #${which} is shown instead of #${
                    i + hint.solution.next
                  }`
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

function fail(s) {
  const e = new Error(s)
  e.stack = ''
  throw e
}
