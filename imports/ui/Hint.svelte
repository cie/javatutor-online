<script>
  import { onDestroy, onMount, tick } from 'svelte'
  import { cubicInOut } from 'svelte/easing'
  import trackEvent from './trackEvent'
  import { fly, fade, slide } from 'svelte/transition'
  import marked from 'marked'
  import { CHAT } from './instructor/ChatBox.svelte'
  export let hint = null
  /** @type monaco.editor.IStandaloneCodeEditor */
  export let editor
  /** @type string */
  export let task_id
  /** @type string */
  export let code

  export let hintClosed = false
  export let resolvedHint = null
  let thanks = false

  let editorWidth = NaN

  $: STUDENTS = Students.find()
  $: student = $STUDENTS && $STUDENTS[0]

  /** time before the hint appears if not specified by the hint */
  const defaultHintDelaySec = 20
  /** time before the Good hint? question appears */
  const resolvedHintDelaySec = 3
  /** estimated time it takes the user to answer the Good hint? question */
  const resolvedHintAnswerSec = 4

  $: if (student && student.group != 'control') {
    getHint(code, task_id)
  }

  function getHint(code, task_id) {
    Meteor.call('getHint', code, task_id, (err, newHint) => {
      if (err) {
        trackEvent({ type: 'Internal error', code, value: err })
        return
      }
      if ((hint && hint.message) !== (newHint && newHint.message)) {
        if (hintClosed) {
          trackEvent({
            type: 'Hint resolved after closed',
            value: `${hint.line}: ${hint.message}`,
            code
          })
        } else if (hint && !(now > hintTime)) {
          trackEvent({
            type: 'Hint resolved before shown',
            value: `${hint.line}: ${hint.message}`,
            code
          })
        } else if (hint) {
          console.log('resolved')
          trackEvent({
            type: 'Hint resolved',
            value: `${hint.line}: ${hint.message}`,
            code
          })
          resolvedHint = hint
          thanks = false
        }
        hint = newHint
        if (hint) {
          const hintTimeout =
            ((hint.delay || defaultHintDelaySec) *
              (Meteor.isDevelopment ? 0.5 : 1) +
              (resolvedHint
                ? resolvedHintDelaySec + resolvedHintAnswerSec
                : 0)) *
            1000
          hintTime = Date.now() + hintTimeout
          hintTime -= 18 // just in case
          setTimeout(() => (now = Date.now()), hintTimeout)
        }
        hintClosed = false
      } else {
        hint = newHint
      }
    })
  }

  let hintTime = 0
  let now = Date.now()
  $: if (hint && now > hintTime && hint != resolvedHint) {
    // once the time is up, hide the old hint's resolved view
    resolvedHint = null
  }
  $: console.log(resolvedHint)

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
  $: Object.assign(window, { hint, resolvedHint, hintClosed })

  const hintLeftMargin = 50
  const hintTopMargin = 30

  function measure() {
    if (!editor) return
    editorWidth = editor.getDomNode().offsetWidth
  }
  let measureInterval
  // for some reason this does not work with window on:resize...
  onMount(() => (measureInterval = setInterval(measure, 500)))
  onDestroy(() => clearInterval(measureInterval))

  function card(
    node,
    { dir = 1, delay = 0, duration = 300, easing = cubicInOut }
  ) {
    const transform = getComputedStyle(node).transform.replace('none', '')
    return {
      delay,
      duration,
      easing,
      css: (t, u) =>
        `transform: ${transform} rotateX(${
          (u / 2) * dir
        }turn); backface-visibility: hidden;`
    }
  }

  async function goodHint() {
    trackEvent({ type: 'Good hint', value: resolvedHint.message, code })
    thanks = true
    await tick()
    resolvedHint = null
  }
  async function badHint() {
    trackEvent({ type: 'Bad hint', value: resolvedHint.message, code })
    thanks = true
    await tick()
    resolvedHint = null
  }
  function closeResolvedHint() {
    trackEvent({
      type: 'Close Good hint question',
      value: resolvedHint.message,
      code
    })
    resolvedHint = null
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
  $: if ($CHAT && resolvedHint) resolvedHint = false
</script>

{#if resolvedHint && !$CHAT}
  <div
    data-harmony-id="Hint resolved bubble"
    in:card|local={{ dir: -1, delay: resolvedHintDelaySec * 1000 }}
    out:fade|local={{ duration: 500, delay: 200 }}
    on:introend={() => trackEvent({
        type: 'Was this hint useful?',
        value: resolvedHint.message
      })}
    class="bubble resolved text-silver-800 px-3 py-2 rounded-lg absolute
    shadow-md right-0 mr-16 text-center h-18"
    class:oversize
    style="top: {top}px; left: {left}px; width: {width}px">
    <div
      class="absolute text-black top-0 right-0 mr-1 opacity-50 hover:opacity-75
      cursor-pointer"
      style="margin-top: -1px;"
      on:click={closeResolvedHint}>
      <i class="fa fa-times text-sm" />
    </div>
    {#if !thanks}
      <p class="text-sm">Was this hint useful?</p>
      <p>
        <button
          class="px-2 mr-4 focus:outline-none text-2xl rounded hover:bg-gray-800
          hover:text-green-400"
          on:click={goodHint}>
          <i class="fa fa-smile-o" />
          Yes
        </button>
        <button
          class="px-2 focus:outline-none text-2xl rounded hover:bg-gray-800
          hover:text-green-400"
          on:click={badHint}>
          <i class="fa fa-frown-o" />
          No
        </button>
      </p>
    {:else}
      <!-- already hiding -->
      <div class="h-full flex flex-col justify-center">
        <p class="text-2xl">Thx!</p>
      </div>
    {/if}
  </div>

{:else if hint && now >= hintTime && !hintClosed}
  <div
    data-harmony-id="Hint bubble"
    in:fly={{ x: 30, duration: 800 }}
    out:card={{ delay: resolvedHint ? resolvedHintDelaySec * 1000 : 0 }}
    on:introstart={hintShown}
    class="bubble text-silver-800 text-sm px-3 py-2 rounded-lg absolute
    shadow-md right-0 mr-16"
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
  </div>
{/if}

<style>
  .bubble {
    background-color: #faf089;
    transform: perspective(50vw);
  }
  :global(.dark) .bubble {
    background-color: #faf089;
  }
  .bubble.resolved {
    background-color: #78d6a7;
  }
  :global(.dark) .bubble.resolved {
    background-color: #78d6a7;
  }
  .bubble:not(.resolved)::before,
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
    border-right: #faf089 solid 6px;
    border-top: #faf089 solid 6px;
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
  .hint-content :global(ul) {
    list-style: disc;
    padding-left: 1em;
  }
</style>
