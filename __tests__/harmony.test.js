const harmony = require('@harmony.ac/js-runner')
const project = require('../JavaTutor.harmony.json')
const child_process = require('child_process')

jest.setTimeout(300000)

try {
  child_process.execSync('git diff --quiet --exit-code')
} catch {
  throw new Error('Working directory not clean')
}

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
