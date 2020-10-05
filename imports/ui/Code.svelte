<script>
  import Editor from './Editor.svelte'
  import Button from './Button.svelte'
  import HelpButton from './HelpButton.svelte'
  import tasks from '../api/tasks.yml'
  import { markdown } from 'markdown'
  import { init } from 'svelte/internal'

  let initialCode = '',
    code = '',
    taskIndex = 0,
    output

  $: task = tasks[taskIndex]
  $: initialCode = task.initialCode
  $: code = initialCode
  $: input = task.input.replace('$NAME', 'Joe')

  let hint = null
  let hintLineNumber = 1

  function run() {
    output = ''
    Meteor.call('run', code, input, (err, res) => {
      if (err) return
      output = res
    })
  }

  function keydown(e) {
    if (e.key === 'Enter' && e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault()
      e.stopPropagation()
      run()
    }
  }
</script>

<div class="h-full flex flex-col" on:keydown|capture={keydown}>
  <div class="flex" style="background: #2e2e2e;">
    <nav class="text-white">
      <a class="text-white" href="#/">JavaTutor</a>
      › {task.title}
    </nav>
  </div>
  <div
    class="flex-1 flex py-2 flex-col md:flex-row"
    style="background: #1e1e1e;">
    <aside
      class="task-description text-white px-4 py-3 bg-gray-800 text-white w-full
      md:w-1/4">
      {@html markdown.toHTML(task.description)}
    </aside>

    <input
      type="hidden"
      data-harmony-id="Java code"
      bind:value={initialCode}
      on:change={e => e.currentTarget.dispatchEvent(new Event('input'))} />
    <div
      class="flex-1 grid grid-rows-1 items-stretch content-stretch relative mt-2
      md:mt-0"
      style="min-height: 210px">
      <Editor value={initialCode} on:change={e => (code = e.detail.value)} />
      <HelpButton />
    </div>

    <input type="hidden" data-harmony-id="Hint" bind:value={hint} />
    <input
      type="hidden"
      data-harmony-id="Hint line number"
      bind:value={hintLineNumber} />
    {#if hint}
      <div
        data-harmony-id="Bubble"
        class="bg-yellow-300 w-16 h-16 rounded-lg absolute">
        <div data-harmony-id="Bubble content">
          {@html hint}
        </div>
      </div>
    {/if}

  </div>
  <footer
    class="flex flex-col md:flex-row text-white"
    style="background: #333;">
    <div class="flex-1 flex flex-col h-full p-2">
      <h2 class="font-bold mb-1">Input</h2>
      <textarea
        bind:value={input}
        rows="5"
        id="input"
        class="bg-transparent block flex-1 font-mono outline-none" />
    </div>
    <div
      class="h-full flex items-center justify-center content-center flex-col">
      <Button on:click={run} data-harmony-id="Run">
        Run
        <span class="ml-2 font-mono">▶</span>
      </Button>
      <small class="text-gray-500">(Ctrl+Enter)</small>
    </div>
    <div class="flex-1 flex flex-col h-full p-2">
      <h2 class="font-bold mb-1">Output</h2>
      <textarea
        rows="5"
        id="output"
        bind:value={output}
        readonly
        data-harmony-id="Output"
        class="bg-transparent block flex-1 font-mono outline-none" />
    </div>
  </footer>
</div>
