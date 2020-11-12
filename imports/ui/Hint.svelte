<script>
  import { onDestroy, onMount } from 'svelte'
  import trackEvent from './trackEvent'
  import { fly, fade } from 'svelte/transition'
  import marked from 'marked'
  export let hint = null
  /** @type monaco.editor.IStandaloneCodeEditor */
  export let editor
  /** @type string */
  export let task_id
  /** @type string */
  export let code

  let hintClosed = false

  let editorWidth = NaN,
    editorHeight = NaN

  $: STUDENTS = Students.find()
  $: student = $STUDENTS && $STUDENTS[0]
  $: answer = student && student.answer
  $: answerTaskId = student && student.answerTaskId

  $: if (student && student.group != 'control') {
    Meteor.call('getHint', code, task_id, (err, newHint) => {
      if (err) {
        trackEvent({ type: 'Internal error', code, value: err })
        return
      }
      if (JSON.stringify(hint) !== JSON.stringify(newHint)) {
        hint = newHint
        hintClosed = false
      }
    })
  }

  let lastHintMessage = null
  let hintTime = 0
  let now = Date.now()
  $: if (hint) {
    if (lastHintMessage !== hint.message) {
      lastHintMessage = hint.message
      const hintTimeout =
        (hint.delay || 20) * 1000 * (Meteor.isDevelopment ? 0.5 : 1)
      hintTime = Date.now() + hintTimeout - 18 // just in case
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

  const hintLeftMargin = 50
  const hintTopMargin = 30

  function measure() {
    if (!editor) return
    editorWidth = editor.getDomNode().offsetWidth
  }
  let measureInterval
  // for some reason this does not work with window on:resize...
  onMount(() => (measureInterval = setInterval(measure, 500)))
  onDestroy(() => clearInterval(measure))

  function goodHint() {
    trackEvent({ type: 'Good hint', code })
  }
  function badHint() {
    trackEvent({ type: 'Bad hint', code })
  }
  function closeHint() {
    hintClosed = true
    trackEvent({ type: 'Close hint', code })
  }
  function hintShown() {
    trackEvent({
      type: 'Automatic hint',
      code,
      value: `${hint.line}: ${hint.message}`
    })
  }
  let lastAnswer
  $: if (lastAnswer != answer && answerTaskId === task_id) {
    lastAnswer = answer
    trackEvent({
      type: 'Hint from instructor',
      code,
      value: `${answer}`
    })
  }

  function hintDisappeared() {
    if (!hintClosed)
      trackEvent({
        type: 'Hint disappeared',
        code
      })
  }
</script>

{#if answer && answerTaskId === task_id}
  <div
    data-harmony-id="Answer bubble"
    class="bubble bubble-answer text-sm px-3 py-2 w-64 rounded-lg absolute
    shadow-sm dark:shadow-md right-0 mr-16"
    in:fly={{ x: 30, duration: 800 }}
    out:fade={{ duration: 800 }}
    class:oversize
    style="top: {top}px">
    {#if oversize}
      <span class="oversize-tail" style="height: {oversizeTailHeight}px" />
    {/if}
    <span class="text-sm text-gray-700">Instructor says:</span>
    <div data-harmony-id="Bubble content">{answer}</div>
  </div>
{:else if hint && now >= hintTime && !hintClosed}
  <div
    data-harmony-id="Hint bubble"
    in:fly={{ x: 30, duration: 800 }}
    out:fade={{ duration: 800 }}
    on:introstart={hintShown}
    on:outrostart={hintDisappeared}
    class="bubble text-sm px-3 py-2 bg-yellow-200 dark:bg-yellow-300 rounded-lg
    absolute shadow-md right-0 mr-16"
    class:oversize
    style="top: {top}px; left: {left}px; width: {width}px">
    {#if oversize}
      <span class="oversize-tail" style="height: {oversizeTailHeight}px" />
    {/if}
    <div
      class="absolute text-black top-0 right-0 mr-1 opacity-50 hover:opacity-75
      cursor-pointer"
      style="margin-top: -1px;"
      on:click={closeHint}>
      <i class="fa fa-times text-sm" />
    </div>
    <div class="hint-content" data-harmony-id="Bubble content">
      {@html marked(hint.message)}
    </div>
    <div
      class="goodHintButtons flex justify-end items-center"
      style="opacity: 0.5; margin-bottom: -8px; margin-right: -8px">
      <small class="goodHint text-xs mr-1">Good hint?</small>
      <button class="p-1 focus:outline-none" on:click={goodHint}>
        <i class="fa fa-smile-o" />
      </button>
      <button class="p-1 focus:outline-none" on:click={badHint}>
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
    border-right-color: #fcf9a5;
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
    transform: translate(-100%, 15px) translate(24px, 0);
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
    width: 19px;
    border-right: #fcf9a5 solid 6px;
    border-top: #fcf9a5 solid 6px;
    transform: translate(0, -100%);
    border-top-right-radius: 20px;
  }
  :global(.dark) .oversize-tail,
  :global(.dark) .oversize-tail::before,
  :global(.dark) .bubble::before {
    border-right-color: #faf089;
  }
  :global(.dark) .oversize-tail {
    border-top-color: #faf089;
  }
  .oversize-tail::before {
    top: -12px;
    border-top-width: 9px;
    border-bottom-width: 9px;
  }
  .goodHintButtons:not(:hover) > .goodHint {
    visibility: hidden;
  }
  .hint-content :global(ul) {
    list-style: disc;
    padding-left: 1em;
  }
</style>
