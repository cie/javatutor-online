<script>
  import Editor from './Editor.svelte'
  import Button from './Button.svelte'
  import HelpButton from './HelpButton.svelte'
  import tasks from '../../imports/tasks.yml'
  import marked from 'marked'
  import { navigate } from 'svelte-routing'
  import trackEvent from './trackEvent'
  import Hint from './Hint.svelte'
  import { onMount } from 'svelte'

  let taskIndex,
    code,
    output,
    editor,
    task,
    input,
    task_id,
    running = false
  onMount(() => {
    task_id = localStorage.getItem('task_id')
    const i = task_id ? tasks.findIndex(t => t.id == task_id) : -1
    setTask(~i ? i : 0)
  })

  const nickname = localStorage.getItem('nickname')

  function setTask(i) {
    taskIndex = i
    task = tasks[taskIndex]
    task_id = task.id
    if (localStorage.getItem('task_id') === task.id) {
      const c = localStorage.getItem('code')
      if (c !== undefined) {
        code = c
      } else {
        code = task.initialCode
      }
    } else {
      localStorage.setItem('task_id', task.id)
      code = task.initialCode
      localStorage.setItem('code', code)
    }
    input = (task.input || '').replace('$NAME', nickname)
    output = ''
  }

  let hint = null

  function run() {
    trackEvent({ type: 'Run', value: input, code })
    running = true
    Meteor.call('run', code, input, (err, res) => {
      running = false
      if (err) {
        output = { error: err }
        return
      }
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
      setTask(++taskIndex)
    } else {
      navigate('/questionnaire')
    }
  }
  function done() {
    trackEvent({ type: 'Done task', code })
    nextTask()
  }
  function change(e) {
    code = e.detail.value
    localStorage.setItem('code', code)
  }
</script>

{#if task}
  <div class="h-full flex flex-col" on:keydown|capture={keydown}>
    <div class="flex" style="background: #2e2e2e;">
      {#each tasks as task, i (i)}
        <div
          class="bg-{i === taskIndex ? 'primary-600' : 'gray-600'} h-3 w-12 mx-1" />
      {/each}
    </div>
    <div
      class="flex-1 flex flex-col lg:flex-row relative py-2"
      style="background: #1e1e1e;">
      <aside
        class="task-description text-white px-4 py-3 bg-gray-800 text-white
        w-full lg:w-4/12 lg:max-w-lg flex flex-col">
        <div class="flex-1">
          <h1>{task.title.replace(/\$NAME\b/g, nickname)}</h1>
          {@html marked(task.description.replace(/\$NAME\b/g, nickname))}
        </div>
        <div>
          <button
            class="rounded-md w-full mt-4 mb-2 text-center px-1 py-3 bg-gray-700
            hidden lg:inline"
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
        class="flex-1 grid grid-rows-1 items-stretch content-stretch relative
        py-2 md:mt-0"
        style="min-height: 410px">
        <Editor bind:editor value={code} on:change={change} />
        <Hint {hint} {editor} {task_id} {code} />
        <HelpButton {code} {task_id} />
      </div>

    </div>
    <footer
      class="flex flex-col md:flex-row text-white"
      style="background: #333">
      <div class="flex-1 flex flex-col h-full p-2">
        <h2 class="font-bold mb-1">Input</h2>
        <div class="user-input flex-1">
          <textarea
            bind:value={input}
            rows="4"
            id="input"
            class="w-full h-full bg-transparent block flex-1 font-mono
            outline-none" />
        </div>
      </div>
      <div
        class="flex items-center justify-center content-center flex-col md:h-40">
        <Button on:click={run} data-harmony-id="Run">
          Run
          <span class="ml-2 font-mono">▶</span>
        </Button>
        <small class="text-gray-500">(Ctrl+Enter)</small>
      </div>
      <div class="flex-1 flex flex-col h-full p-2">
        <h2 class="font-bold mb-1">Output</h2>
        {#if output.error}
          <div class="flex-1 flex justify-center items-center">
            <span>
              Error running :(
              <br />
              {output.error}
            </span>
          </div>
        {:else}
          <pre class="output flex-1 relative" data-harmony-id="Output">
            <code>{output}</code>
            {#if running}
              <div
                class="absolute inset-0 output bg-gray-500 bg-opacity-25 flex-1
                flex justify-center items-center sans-serif">
                <span>Running...</span>
              </div>
            {/if}
          </pre>
        {/if}
      </div>
    </footer>

    <aside
      class="task-description text-white px-4 py-3 text-white w-full lg:hidden
      flex flex-col">
      <div>
        <button
          class="rounded-md w-full mt-4 mb-2 text-center px-1 py-3 bg-gray-700
          lg:hidden"
          on:click|preventDefault={done}>
          <i class="fa fa-check-circle" />
          {#if taskIndex < tasks.length - 1}
            Done, move to the next task
          {:else}Done{/if}
        </button>
      </div>
    </aside>
  </div>
{/if}

<style>
  textarea {
    resize: none;
  }
</style>
