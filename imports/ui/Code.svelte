<script>
  import Editor from './Editor.svelte'
  import Button from './Button.svelte'
  import HelpButton from './HelpButton.svelte'
  import tasks from '../tasks.yml'
  import marked from 'marked'
  import { navigate } from 'svelte-routing'
  import trackEvent from './trackEvent'
  import Hint from './Hint.svelte'
  import { onMount, tick } from 'svelte'
  import ChatBox, { CHAT } from './instructor/ChatBox.svelte'

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

  const student_id = localStorage.getItem('student_id')
  const nickname = localStorage.getItem('nickname')
  /** @type HTMLElement */
  let top

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
      trackEvent({ type: 'Start task', value: task_id })
      Meteor.call('setTask', { student_id, task_id })
      Meteor.call('editCode', { student_id, code })
    }
    input = (task.input || '').replace('$NAME', nickname)
    output = ''
    $CHAT = false
    if (top) top.scrollIntoView({ behavior: 'smooth' })
  }

  let hint = null

  function run() {
    trackEvent({ type: 'Run', value: input, code })
    running = true
    Meteor.call('run', { code, input, student_id }, (err, res) => {
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
    trackEvent({ type: 'Edit code', code })
    Meteor.call('editCode', { student_id, code })
  }
  $: $CHAT, tick().then(() => window.dispatchEvent(new Event('resize')))
</script>

{#if task}
  <div bind:this={top} />
  <div class="h-full flex flex-col" on:keydown|capture={keydown}>
    <div class="flex-none flex dark:bg-silver-800 bg-gray-300 items-center">
      <span class="text-gray-700 dark:text-gray-500 ml-4 mr-3">
        Task {taskIndex + 1}/{tasks.length}
      </span>
      <div class="flex rounded-full overflow-hidden h-4 opacity-75">
        <div class="bg-orange-400 h-4 w-4" />
        {#each tasks as task, i (i)}
          <div
            class="{i < taskIndex ? 'bg-orange-400' : 'bg-gray-500 dark:bg-silver-500'}
            h-4 w-16" />
        {/each}
      </div>
    </div>
    <div
      class="flex-1 flex flex-col lg:flex-row relative py-2 dark:bg-silver-900
      bg-white">
      <aside
        class="task-description dark:text-white px-4 py-3 dark:bg-gray-800
        bg-gray-200 dark:text-white w-full lg:w-4/12 lg:max-w-lg flex flex-col">
        <div class="flex-1">
          <h1>{task.title.replace(/\$NAME\b/g, nickname)}</h1>
          {@html marked(task.description.replace(/\$NAME\b/g, nickname))}
        </div>
        <div>
          <button
            class="rounded-md w-full mt-4 mb-2 text-center px-1 py-3
            dark:bg-gray-700 bg-gray-400 hidden lg:inline"
            on:click|preventDefault={done}>
            <i class="fa fa-check-circle" />
            {#if taskIndex < tasks.length - 1}
              Done, move to the next task
            {:else}Done{/if}
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
        <Editor
          bind:editor
          value={code}
          on:change={change}
          uri={`workspace:${student_id}/${task_id}.java`} />
        {#each [task_id] as key (key)}
          <Hint {hint} {editor} {task_id} {code} />
        {/each}
        <HelpButton {code} {task_id} />
      </div>
      {#if $CHAT}
        <div class="h-full" style="flex: 0.45;">
          <ChatBox {student_id} {task_id} />
        </div>
      {/if}

    </div>
    <footer
      class="flex flex-col md:flex-row dark:text-white dark:bg-silver-700
      bg-gray-200">
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
                class="absolute inset-0 output dark:bg-gray-500 bg-gray-500
                bg-opacity-25 flex-1 flex justify-center items-center sans-serif">
                <span>Running...</span>
              </div>
            {/if}
          </pre>
        {/if}
      </div>
    </footer>

    <aside
      class="task-description dark:text-white px-4 py-3 dark:text-white w-full
      lg:hidden flex flex-col">
      <div>
        <button
          class="rounded-md w-full mt-4 mb-2 text-center px-1 py-3
          dark:bg-gray-700 bg-gray-300 lg:hidden"
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
