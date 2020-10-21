<script>
  import { onMount } from 'svelte'
  import trackEvent from './trackEvent'
  export let hint = null
  /** @type monaco.editor.IStandaloneCodeEditor */
  export let editor
  /** @type string */
  export let task_id
  /** @type string */
  export let code

  $: STUDENTS = Students.find()
  $: student = $STUDENTS && $STUDENTS[0]
  $: answer = student && student.answer
  $: answerTaskId = student && student.answerTaskId

  let top, left

  $: {
    Meteor.call('getHint', code, task_id, (err, newHint) => {
      if (err) {
        trackEvent({ type: 'Internal error', code, value: err })
        return
      }
      hint = newHint
      trackEvent({ type: 'Automatic hint', code, value: newHint })
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
  }

  const width = 304
  const hintTimeout = (Meteor.isDevelopment ? 8 : 30) * 1000
  const hintHideTimeout = (Meteor.isDevelopment ? 3 : 4) * 1000

  const hintLeftMargin = 20
</script>

{#if answer && answerTaskId === task_id}
  <div
    data-harmony-id="Answer bubble"
    class="bubble text-sm px-3 py-2 bg-orange-300 w-64 rounded-lg absolute
    shadow-md right-0 mr-16"
    style="top: {top}px">
    <div data-harmony-id="Bubble content">
      {@html hint.message}
    </div>
  </div>
{:else if hint && now >= hintTime}
  <div
    data-harmony-id="Hint bubble"
    class="bubble text-sm px-3 py-2 bg-yellow-300 rounded-lg absolute shadow-md
    right-0 mr-16"
    style="top: {top}px; left: {left}px; width: {width}px">
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
  .bubble::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 12px;
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
