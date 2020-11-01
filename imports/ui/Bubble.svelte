<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  import { fly, fade } from 'svelte/transition'
  import HintRating from './HintRating.svelte'
  import MeasureEditorSize from './MeasureEditorSize.svelte'
  export let type
  export let editor
  export let rating
  let top, left
  const width = 304
  let oversize
  let oversizeTailHeight
  let editorWidth

  const hintLeftMargin = 50
  const hintTopMargin = 30

  $: {
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
</script>

<MeasureEditorSize {editor} bind:editorWidth />
<div
  data-harmony-id="Bubble"
  in:fly={{ x: 30, duration: 800 }}
  out:fade={{ duration: 800 }}
  on:introstart={() => dispatch('show')}
  on:outrostart={() => dispatch('hide')}
  class="bubble text-sm px-3 py-2 bg-yellow-300 rounded-lg absolute shadow-md
  right-0 mr-16 {type}"
  class:oversize
  style="top: {top}px; left: {left}px; width: {width}px">
  {#if oversize}
    <span class="oversize-tail" style="height: {oversizeTailHeight}px" />
  {/if}
  <div
    class="absolute text-black top-0 right-0 mr-1 opacity-50 hover:opacity-75
    cursor-pointer"
    style="margin-top: -1px;"
    on:click={() => dispatch('close')}>
    <i class="fa fa-times text-sm" />
  </div>
  <div class="hint-content" data-harmony-id="Bubble content">
    <slot />
  </div>
  {#if rating}
    <HintRating />
  {/if}
</div>

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
