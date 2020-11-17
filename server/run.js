import { Students } from '../imports/api/Students'
import { Promise } from 'meteor/promise'

const fs = require('fs')
const { mkdirSync } = fs
const child_process = require('child_process')
const { promisify } = require('util')

const exec = promisify(child_process.exec)

export default async function run({ code, input, student_id }) {
  const dir = `/tmp/javatutor-${student_id}`
  mkdirSync(dir, { recursive: true })
  const m = code.match(/public\s+class\s+(\w+)/)
  if (!m)
    throw new Error(
      'The code must contain a public class, e.g.\npublic class MyClass {\n    ...\n}'
    )
  const className = m[1]
  fs.writeFileSync(`${dir}/${className}.java`, code)
  try {
    await exec(`javac ${className}.java`, { cwd: dir })
  } catch (e) {
    return e.stdout + '\n' + e.message
  }
  fs.writeFileSync(`${dir}/input.txt`, input)
  const result = await new Promise(r =>
    child_process.exec(
      `java ${className} < input.txt`,
      { cwd: dir, timeout: 3000, maxBuffer: 2 * 1024 },
      (err, stdout, stderr) => {
        r(stdout.toString() + (err ? '\n' + err.message : ''))
      }
    )
  )
  return result
}

if (typeof Meteor !== 'undefined')
  Meteor.methods({
    async run(opts) {
      const output = Promise.await(run(opts))
      const { student_id } = opts
      Students.update(student_id, { $set: { output } })
      return output
    }
  })
