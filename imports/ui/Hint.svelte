<script>
  import { onDestroy, onMount } from 'svelte'
  import trackEvent from './trackEvent'
  import { fly, fade } from 'svelte/transition'
  export let hint = null
  /** @type monaco.editor.IStandaloneCodeEditor */
  export let editor
  /** @type string */
  export let task_id
  /** @type string */
  export let code

  let editorWidth = NaN,
    editorHeight = NaN

  $: STUDENTS = Students.find()
  $: student = $STUDENTS && $STUDENTS[0]
  $: answer = student && student.answer
  $: answerTaskId = student && student.answerTaskId

  $: {
    Meteor.call('getHint', code, task_id, (err, newHint) => {
      if (err) {
        trackEvent({ type: 'Internal error', code, value: err })
        return
      }
      hint = newHint
      trackEvent({
        type: 'Automatic hint',
        code,
        value: JSON.stringify(newHint)
      })
    })
  }

  let lastHintMessage = null
  let hintTime = 0
  let now = Date.now()
  $: if (hint) {
    if (lastHintMessage !== hint.message) {
      lastHintMessage = hint.message
      hintTime = Date.now() + hintTimeout
      setTimeout(() => (now = Date.now()), hintTimeout)
    }
  }

  let top, left
  const width = 304
  let oversize
  let oversizeTailHeight

  $: if (hint && editor) {
    top = editor.getTopForPosition(hint.line)
    const lineWidths = []
    for (let line = 1; line <= editor.getModel().getLineCount(); ++line) {
      const col = editor.getModel().getLineMaxColumn(line)
      lineWidths[line - 1] = editor.getOffsetForColumn(line, col)
    }
    left =
      editor.getLayoutInfo().contentLeft +
      Math.max(...lineWidths) +
      hintLeftMargin
    oversize = left > editorWidth - width
    if (oversize) {
      const lastLine =
        editor.getTopForPosition(editor.getModel().getLineCount()) +
        hintTopMargin
      oversizeTailHeight = lastLine - top
      top = lastLine
      left = Math.max(left, width)
    }
  }

  const hintTimeout = (Meteor.isDevelopment ? 4 : 18) * 1000

  const hintLeftMargin = 35
  const hintTopMargin = 30

  function measure() {
    if (!editor) return
    editorWidth = editor.getDomNode().offsetWidth
  }
  let measureInterval
  // for some reason this does not work with window on:resize...
  onMount(() => (measureInterval = setInterval(measure, 500)))
  onDestroy(() => clearInterval(measure))
</script>

{#if answer && answerTaskId === task_id}
  <div
    data-harmony-id="Answer bubble"
    class="bubble bubble-answer text-sm px-3 py-2 w-64 rounded-lg absolute
    shadow-md right-0 mr-16"
    class:oversize
    style="top: {top}px">
    {#if oversize}
      <span class="oversize-tail" style="height: {oversizeTailHeight}px" />
    {/if}
    <span class="text-sm text-gray-700">Instructor says:</span>
    <div data-harmony-id="Bubble content">{answer}</div>
  </div>
{:else if hint && now >= hintTime}
  <div
    data-harmony-id="Hint bubble"
    in:fly={{ x: 30, duration: 800 }}
    out:fade={{ duration: 800 }}
    class="bubble text-sm px-3 py-2 bg-yellow-300 rounded-lg absolute shadow-md
    right-0 mr-16"
    class:oversize
    style="top: {top}px; left: {left}px; width: {width}px">
    {#if oversize}
      <span class="oversize-tail" style="height: {oversizeTailHeight}px" />
    {/if}
    <div data-harmony-id="Bubble content">
      {@html hint.message}
    </div>
    <div
      class="goodHintButtons flex justify-end items-center"
      style="opacity: 0.5; margin-bottom: -8px; margin-right: -8px">
      <small class="goodHint text-xs mr-1">Good hint?</small>
      <button class="p-1 focus:outline-none">
        <i class="fa fa-smile-o" />
      </button>
      <button class="p-1 focus:outline-none">
        <i class="fa fa-frown-o" />
      </button>
    </div>
  </div>
{/if}

<style>
  .bubble::before,
  .oversize-tail::before {
    content: '';
    position: absolute;
    left: -23px;
    border: solid transparent;
    border-right-color: #faf089;
    border-right-width: 20px;
    border-top-width: 7px;
    border-bottom-width: 7px;
  }
  .bubble::before {
    top: 12px;
  }
  .bubble-answer {
    background-color: #f0bb6c;
  }
  .bubble.oversize {
    transform: translate(-100%, 12px) translate(22px, 0);
  }
  .bubble.oversize::before {
    content: none;
  }
  .oversize-tail {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    right: 10px;
    width: 4px;
    background: #faf089;
    transform: translate(0, -100%);
    border-top-right-radius: 4px;
  }
  .goodHintButtons:not(:hover) > .goodHint {
    visibility: hidden;
  }
</style>
