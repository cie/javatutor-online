import tasks from './tasks'

import { DOMParserImpl as DOMParser } from 'xmldom-ts'
import * as xpath from 'xpath-ts'
import { execSync } from 'child_process'

export async function getSrcML(code) {
  return execSync('srcml --position --language=Java', {
    input: code
  })
    .toString()
    .replace('xmlns="http://www.srcML.org/srcML/src"', '')
}

export default async function getHints(code, task_id) {
  try {
    const srcml = await getSrcML(code)
    const doc = new DOMParser().parseFromString(srcml, 'application/srcml+xml')
    const task = tasks.find(t => t.id === task_id)
    if (!task) {
      console.error(`Unknown id: ${task_id}`)
      return []
    }
    return task.hints
      .map(hint => {
        const n = xpath.select(hint.match, doc, true)
        if (!n) return null
        const start = n.getAttributeNS(
          'http://www.srcML.org/srcML/position',
          hint.hook || 'start'
        )
        const line = start ? +start.split(':')[0] : 1
        return {
          ...hint,
          line
        }
      })
      .filter(Boolean)
  } catch (e) {
    console.error(e.stack)
    return []
  }
}
