import fs from 'fs'
import child_process from 'child_process'
import { promisify } from 'util'

const exec = promisify(child_process.exec)

Meteor.methods({
  async run(code, input) {
    const m = code.match(/public\s+class\s+(\w+)/)
    if (!m)
      throw new Error(
        'The code must contain a public class, e.g.\npublic class MyClass {\n    ...\n}'
      )
    const className = m[1]
    fs.writeFileSync(`${className}.java`, code)
    try {
      await exec(`javac ${className}.java`)
    } catch (e) {
      return e.message
    }
    fs.writeFileSync('input.txt', input)
    let result
    try {
      result = (
        await exec(`java ${className} < input.txt`, { timeout: 3000 })
      ).toString()
    } catch (e) {
      return e.message
    }
    console.log(result)
    return result
  }
})
