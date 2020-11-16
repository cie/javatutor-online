require('@babel/register')
require('array-flat-polyfill')
const globToRegexp = require('glob-to-regexp')
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

describe('tasks', () => {
  const tasks = safeLoad(fs.readFileSync(__dirname + '/../imports/tasks.yml'))
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
          if (!hint.solution) return it(hint.message + ' - no solution given')
          const solutions = [].concat(hint.solution)
          solutions.forEach((solution, solutionIndex) => {
            const oldCode = solution.code || code
            const { turn, into, after, add } = solution
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
            if (!solution.code && solutionIndex == 0) code = newCode

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
              if (!hintsBefore[0]) fail('Did not show the hint: ' + oldCode)
              if (hintsBefore[0].message !== message) {
                const which = hints.findIndex(
                  h => h.message === hintsBefore[0].message
                )
                if (which < i)
                  fail('An earlier hint was shown: ' + hintsBefore[0].message)
                else if (which > i)
                  fail(
                    'Did not show the hint, a later hint was shown: ' + oldCode
                  )
                else fail('Something went wrong')
              }
              const hintsAfter = await getHints(newCode, task.id)
              if (hintsAfter[0] && hintsAfter[0].message === message)
                fail('Hint did not disappear after change\n' + newCode)

              if (!solution.done && !solution.next)
                fail('done or next is required in solution')
              if (solution.next) {
                if (!hintsAfter[0])
                  fail(`ALMOST GOOD, but after solving, no hint was shown`)
                const which = hints.findIndex(
                  h => h.message === hintsAfter[0].message
                )
                if (!~which)
                  fail('Some unknown hint is shown: ' + hintsAfter[0].message)
                if (which !== i + solution.next)
                  fail(
                    `After solving, hint #${which + 1} is shown instead of #${
                      i + solution.next + 1
                    }:  ${hintsAfter[0].message}\n${newCode}`
                  )
              }
            })

            if (solution.done) {
              if (!task.expectedOutput)
                return it(hint.message + ' - no expectedOutput')
              it('runs', async () => {
                const output = await run({
                  code,
                  input: task.input,
                  student_id: 'test'
                })
                try {
                  if (
                    output
                      .trim()
                      .match(globToRegexp(task.expectedOutput.trim()))
                  )
                    return
                } catch {}
                assert.equal(output.trim(), task.expectedOutput.trim())
              })
            }
          })
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
