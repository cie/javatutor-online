const fs = require('fs')
const project = require('../JavaTutor.harmony.json')
const child_process = require('child_process')

// THIS FILE IS only an experiment.

jest.setTimeout(300000)

describe('e2e tests', () => {
  harmony(project, {
    describe,
    test,
    async start() {
      if (process.cwd().match(/\.stryker/)) {
        child_process.execSync('cp -Rf client server imports ../../')
        await sleep(2000)
      }
    }
  })
})

function sleep(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
}

function harmony(project, { describe, test, start }) {
  describe('Harmony tests', () => {
    test('harmony tests', async () => {
      await start()
      const resultFile = 'harmony_result.json'
      while (!fs.existsSync(resultFile)) {
        await sleep(1000)
      }
      const result = JSON.parse(fs.readFileSync(resultFile).toString())
      fs.unlinkSync(resultFile)
      if (result === true) return
      throw new Error(result || 'Failed')
    })
  })
}
