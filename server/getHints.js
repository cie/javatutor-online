import java from 'java'
import glob from 'glob'
import fs from 'fs'
import { promisify } from 'util'
import { safeLoad } from 'js-yaml'

function setup() {
  const pmdDir = asset('tasks.yml').replace('tasks.yml', 'pmd')
  const tasks = safeLoad(fs.readFileSync(asset('tasks.yml')))
  const tmpDir = require('tmp').dirSync().name
  fs.mkdirSync(`${tmpDir}/hints/tasks`, { recursive: true })

  if (!java.isJvmCreated()) {
    if (process.env.DEBUG_JAVA)
      java.options.push(
        '-agentlib:jdwp=transport=dt_socket,address=127.0.0.1:8000'
      )
    java.asyncOptions = {
      asyncSuffix: undefined, // Don't generate node-style methods taking callbacks
      syncSuffix: '',
      promiseSuffix: 'P',
      promisify
    }

    java.classpath.push(...glob.sync(`${pmdDir}/lib/*.jar`))
    fs.mkdirSync(`${pmdDir}/hints/tasks`, { recursive: true })
    java.classpath.push(...glob.sync(`${tmpDir}/hints`))
    java.classpath.push(...glob.sync(`${pmdDir}/utils`))
  }

  console.log(`writing tasks to ${tmpDir}`)
  tasks.forEach(({ id, title, hints }) => {
    fs.writeFileSync(
      `${tmpDir}/hints/tasks/${id}.xml`,
      `<?xml version="1.0"?>
<ruleset name="Hints for ${title}"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd">
    
    ${hints
      .map(
        ({ message, match }, i) => `
    <rule name="Hint${i + 1}"
          language="java"
          since="4.2"
          class="javatutor.DumbXPathRule"
          typeResolution="true"
          message="${escape(message)}">
        <priority>1</priority>
        <properties>
            <property name="version" value="2.0"/>
            <property name="xpath">
                <value>
                <![CDATA[
                  ${match}
                ]]>
                </value>
            </property>
        </properties>
    </rule> 
    `
      )
      .join('\n')}
</ruleset>
`
    )
  })
  console.log('written tasks')
  java.ensureJvm()
  console.log('jvm started')
}
// https://github.com/joeferner/node-java/issues/38
setTimeout(setup, 0)

async function getHints(code, task_id) {
  const Arrays = java.import('java.util.Arrays')
  console.log('Arrays imported')
  const SourceCodeProcessor = java.import(
    'net.sourceforge.pmd.SourceCodeProcessor'
  )

  const PMDConfiguration = java.import('net.sourceforge.pmd.PMDConfiguration')
  const RuleContext = java.import('net.sourceforge.pmd.RuleContext')
  const PmdRunnable = java.import('net.sourceforge.pmd.processor.PmdRunnable')
  const RulesetsFactoryUtils = java.import(
    'net.sourceforge.pmd.RulesetsFactoryUtils'
  )
  // based on https://pmd.github.io/pmd-6.28.0/pmd_userdocs_tools_java_api.html
  // and net.sourceforge.pmd.processor.AbstractPMDProcessor
  const configuration = new PMDConfiguration()
  configuration.setRuleSets(`tasks/${task_id}.xml`)
  const factory = RulesetsFactoryUtils.createFactory(configuration)
  const ruleSets = RulesetsFactoryUtils.getRuleSets(
    configuration.getRuleSets(),
    factory
  )

  const dataSource = java.newProxy(
    'net.sourceforge.pmd.util.datasource.DataSource',
    {
      getNiceFileName: (shortNames, inputFileName) => 'Code.java',
      getInputStream: () => inputStreamFrom(code),
      close: () => {}
    }
  )
  const fileName = 'Code.java'
  const renderers = Arrays.asList()
  const ruleContext = new RuleContext()
  const processor = new SourceCodeProcessor(configuration)

  const runnable = new PmdRunnable(
    dataSource,
    fileName,
    renderers,
    ruleContext,
    ruleSets,
    processor
  )
  const report = await runnable.callP()

  for (const x of report.getProcessingErrors().toArray()) {
    throw x.getMessage()
  }
  return report
    .getViolations()
    .toArray()
    .map(v => ({
      message: v.getDescription(),
      line: v.getBeginLine()
    }))
}

function inputStreamFrom(code) {
  const ByteArrayInputStream = java.import('java.io.ByteArrayInputStream')
  return new ByteArrayInputStream(
    java.newArray('byte', [...Buffer.from(code, 'utf-8')])
  )
}

function asset(name) {
  return typeof Assets !== 'undefined'
    ? Assets.absoluteFilePath(name)
    : `${__dirname}/../private/${name}`
}

function escape(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

// https://github.com/joeferner/node-java/issues/38
// break out from Meteor Fibers system
const breakout = fn => (...args) =>
  Meteor.wrapAsync(function (cb) {
    setTimeout(() => {
      fn(...args).then(
        result => cb(null, result),
        err => cb(err)
      )
    }, 0)
  })()

export default breakout(getHints)
