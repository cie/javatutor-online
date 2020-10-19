import java from 'java'
import glob from 'glob'
import fs from 'fs'
import { promisify } from 'util'

if (!java.isJvmCreated()) {
  java.options.push('-agentlib:jdwp=transport=dt_socket,address=127.0.0.1:8000')
  java.asyncOptions = {
    asyncSuffix: undefined, // Don't generate node-style methods taking callbacks
    syncSuffix: '',
    promiseSuffix: 'P',
    promisify
  }

  const pmdDir =
    typeof Assets !== 'undefined'
      ? Assets.absoluteFilePath('pmd')
      : `${__dirname}/../../private/pmd`
  java.classpath.push(...glob.sync(`${pmdDir}/lib/*.jar`))
  fs.mkdirSync(`${pmdDir}/hints/tasks`, { recursive: true })
  java.classpath.push(...glob.sync(`${pmdDir}/hints`))

  fs.writeFileSync(
    `${pmdDir}/hints/tasks/hello-world.xml`,
    `<?xml version="1.0"?>
<ruleset name="Hints for Hello, World"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd">
    
    <description>
      Hints for Hello, World! task
    </description>

    <rule name="Hint1"
          language="java"
          since="4.2"
          class="net.sourceforge.pmd.lang.rule.XPathRule"
          typeResolution="true"
          message="Hello, message!">
        <description>Hi</description>
        <priority>1</priority>
        <properties>
            <property name="version" value="2.0"/>
            <property name="xpath">
                <value>
<![CDATA[
  /*
]]>
                </value>
            </property>
        </properties>
    </rule> 
</ruleset>
`
  )
}

const File = java.import('java.io.File')
const ArrayList = java.import('java.util.ArrayList')
const Arrays = java.import('java.util.Arrays')
const ByteArrayInputStream = java.import('java.io.ByteArrayInputStream')

const PMD = java.import('net.sourceforge.pmd.PMD')
const PMDConfiguration = java.import('net.sourceforge.pmd.PMDConfiguration')
const RuleContext = java.import('net.sourceforge.pmd.RuleContext')
const RulePriority = java.import('net.sourceforge.pmd.RulePriority')
const XPathRule = java.import('net.sourceforge.pmd.lang.rule.XPathRule')
const RulesetsFactoryUtils = java.import(
  'net.sourceforge.pmd.RulesetsFactoryUtils'
)
const FileDataSource = java.import(
  'net.sourceforge.pmd.util.datasource.FileDataSource'
)

export default async function getHints(code, hints) {
  // based on https://pmd.github.io/pmd-6.28.0/pmd_userdocs_tools_java_api.html
  const configuration = new PMDConfiguration()
  configuration.setRuleSets('tasks/hello-world.xml')
  const ruleSetFactory = RulesetsFactoryUtils.createFactory(configuration)

  const ctx = new RuleContext()
  const files = Arrays.asList(
    java.newProxy('net.sourceforge.pmd.util.datasource.DataSource', {
      getNiceFileName(shortNames, inputFileName) {
        return 'Code.java'
      },
      getInputStream() {
        return new ByteArrayInputStream(
          java.newArray('byte', [...Buffer.from(code, 'utf-8')])
        )
      },
      close() {}
    })
  )
  await PMD.processFilesP(
    configuration,
    ruleSetFactory,
    files,
    ctx,
    new ArrayList()
  )
  const report = ctx.getReport()
  for (const x of report.getProcessingErrors().toArray()) {
    throw x
    ű
  }
  return ctx.getReport().getViolations().toArray()
}
