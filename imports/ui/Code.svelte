<script>
  import Editor from './Editor.svelte'
  import Button from './Button.svelte'
  import HelpButton from './HelpButton.svelte'
  import tasks from '../../private/tasks.yml'
  import { markdown } from 'markdown'
  import { navigate } from 'svelte-routing'
  import trackEvent from './trackEvent'
  import { onMount } from 'svelte'

  let taskIndex = 0,
    code = tasks[taskIndex].initialCode,
    output,
    editor

  $: task = tasks[taskIndex]
  $: task_id = task.id
  $: localStorage.setItem('task_id', task.id)
  $: input = (task.input || '').replace('$NAME', 'Joe')

  let hint = null
  let hintTop = 0
  const hintTimeoutSec = Meteor.isDevelopment ? 5 : 30
  const hintHideTimeoutSec = Meteor.isDevelopment ? 3 : 4
  let hintTimeout

  function run() {
    trackEvent({ type: 'Run', value: input, code })
    output = ''
    Meteor.call('run', code, input, (err, res) => {
      if (err) return
      output = res
      trackEvent({ type: 'Run done', value: output, code })
    })
  }

  function keydown(e) {
    if (e.key === 'Enter' && e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault()
      e.stopPropagation()
      run()
    }
  }

  function nextTask() {
    if (taskIndex < tasks.length - 1) {
      ++taskIndex
      output = ''
    } else {
      navigate('/questionnaire')
    }
  }
  function done() {
    trackEvent({ type: 'Done task', code })
    nextTask()
  }
  function handleCodeChange(e) {
    code = e.detail.value
    trackEvent({ type: 'Edit code', code })
    if (hintTimeout) clearTimeout(hintTimeout)
    hintTimeout = setTimeout(
      getHint,
      (hint ? hintTimeoutSec : hintHideTimeoutSec) * 1000
    )
  }

  function getHint() {
    console.log({ code, task_id })
    Meteor.call('getHint', code, task_id, (err, newHint) => {
      if (err) {
        trackEvent({ type: 'Internal error', code, value: err })
        return
      }
      if (!hint) {
        hint = newHint
        if (hint) {
          hintTop = editor.getTopForPosition(newHint.line)
        }
      } else if (newHint !== hint) {
        hint = null
        setTimeout(getHint, hintTimeoutSec * 1000)
      }
      trackEvent({ type: 'Automatic hint', code, value: hint })
    })
  }

  onMount(() => {
    setTimeout(getHint, hintTimeoutSec * 1000)
  })
</script>

<div class="h-full flex flex-col" on:keydown|capture={keydown}>
  <div class="flex" style="background: #2e2e2e;">
    {#each tasks as task, i (i)}
      <div
        class="bg-{i === taskIndex ? 'primary-600' : 'gray-600'} h-3 w-12 mx-1" />
    {/each}
  </div>
  <div
    class="flex-1 flex py-2 flex-col md:flex-row"
    style="background: #1e1e1e;">
    <aside
      class="task-description text-white px-4 py-3 bg-gray-800 text-white w-full
      md:w-1/4 flex flex-col">
      <div class="flex-1">
        <h1>{task.title}</h1>
        {@html markdown.toHTML(task.description)}
      </div>
      <div>
        <button
          class="rounded-md w-full mt-4 mb-2 text-center px-1 py-3 bg-gray-700"
          on:click|preventDefault={done}>
          <i class="fa fa-check-circle" />
          Done, move to the next task
        </button>
      </div>

    </aside>

    <input
      type="hidden"
      data-harmony-id="Java code"
      bind:value={code}
      on:change={e => e.currentTarget.dispatchEvent(new Event('input'))} />
    <div
      class="flex-1 grid grid-rows-1 items-stretch content-stretch relative mt-2
      md:mt-0"
      style="min-height: 410px">
      <Editor bind:editor value={code} on:change={handleCodeChange} />
      <HelpButton {code} {task_id} />
    </div>

    {#if hint}
      <div
        data-harmony-id="Bubble"
        class="hintBubble text-sm px-3 py-2 bg-yellow-300 w-64 rounded-lg
        absolute shadow-md right-0 mr-16"
        style="top: {hintTop}px">
        <div data-harmony-id="Bubble content">
          {@html hint.message}
        </div>
        <div
          class="goodHintButtons flex justify-end items-center"
          style="opacity: 0.5; margin-bottom: -8px; margin-right: -8px">
          <small class="goodHint text-xs mr-1">Good hint?</small>
          <button class="p-1">
            <i class="fa fa-smile-o" />
          </button>
          <button class="p-1">
            <i class="fa fa-frown-o" />
          </button>
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

<style>
  .hintBubble::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 24px;
    border: solid transparent;
    border-right-color: #faf089;
    border-right-width: 20px;
    border-top-width: 7px;
    border-bottom-width: 7px;
  }
  .goodHintButtons:not(:hover) > .goodHint {
    visibility: hidden;
  }
</style>
