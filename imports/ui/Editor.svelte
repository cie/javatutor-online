<script>
  import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte'
  import { DARK } from './DarkSwitch.svelte'
  import setupLanguageClient from './languageClient'
  export let value
  export let uri
  export let readOnly = false

  /** @type monaco.editor.IStandaloneCodeEditor */
  export let editor = undefined

  export let growHeight = true
  export let selection = null
  export let model = undefined

  let editorEl
  const minMinHeight = 250
  const margin = 20
  let minHeight = minMinHeight
  const dispatch = createEventDispatcher()

  $: if (editor && model && model.uri !== uri) {
    model = monaco.editor.getModel(uri)
    if (!model) {
      model = monaco.editor.createModel(value, 'java', uri)
      model.onDidChangeContent(() => {
        const value = model.getValue()
        dispatch('change', { value })
        if (growHeight) {
          const newMinHeight = Math.max(
            minMinHeight,
            editor.getTopForLineNumber(model.getLineCount() + 1) + margin
          )
          if (minHeight != newMinHeight) {
            minHeight = newMinHeight
            tick().then(() => window.dispatchEvent(new Event('resize')))
          }
        }
      })
    }
    editor.setModel(model)
  }
  $: if (editor && model) {
    if (model.getValue() !== value) model.setValue(value)
  }

  /** @type monaco.editor.IEditorConstructionOptions */
  const editorOptions = {
    minimap: {
      enabled: false
    },
    codeLens: false,
    scrollBeyondLastLine: false
  }

  onMount(() => {
    window.require.config({
      baseUrl: '/'
    })
    window.require(['vs/editor/editor.main'], () => {
      setupEditor()
    })
  })
  const disposers = []
  //onDestroy(() => disposers.forEach(x => x.dispose()))

  function setupEditor() {
    if (typeof monaco === 'undefined') {
      setTimeout(setupEditor, 10)
      return
    }
    model = monaco.editor.getModel(uri)
    if (!model) {
      model = monaco.editor.createModel(value, 'java', uri)
      model.onDidChangeContent(() => {
        const value = model.getValue()
        dispatch('change', { value })
        if (growHeight) {
          const newMinHeight = Math.max(
            minMinHeight,
            editor.getTopForLineNumber(model.getLineCount() + 1) + margin
          )
          if (minHeight != newMinHeight) {
            minHeight = newMinHeight
            tick().then(() => window.dispatchEvent(new Event('resize')))
          }
        }
      })
    }
    if (!editor) {
      editor = window.editor = monaco.editor.create(editorEl, {
        ...editorOptions,
        model,
        readOnly
      })
      disposers.push(setupLanguageClient(editor))
      editor.onDidChangeCursorSelection(e => {
        selection = e.selection
      })
    }
  }

  $: console.log($DARK)
  $: if (editor) {
    console.log($DARK ? 'vs-dark' : 'vs-light')
    monaco.editor.setTheme($DARK ? 'vs-dark' : 'vs-light')
  }

  function onResize() {
    if (!editor) return
    // hack - do not invalidate editor variable
    const e = editor
    // hack - let the editor re-layout itself
    e._domElement.style.display = 'none'
    editor.layout()
    e._domElement.style.display = ''
    editor.layout()
  }

  function onWheel(event) {
    if (!editor) return
    if (!growHeight) return
    const horiz = event.deltaX !== 0
    const maxScrollTop =
      editor.getScrollHeight() - editor.getDomNode().offsetHeight
    const atTopEnd = editor.getScrollTop() == 0
    const atBottomEnd = editor.getScrollTop() == maxScrollTop
    if (
      !horiz &&
      ((event.deltaY < 0 && atTopEnd) || (event.deltaY > 0 && atBottomEnd))
    )
      event.stopPropagation()
  }
</script>

<svelte:window on:resize={onResize} />

<div
  class="dark:bg-silver-900"
  bind:this={editorEl}
  on:wheel|capture={onWheel}
  style="{growHeight ? `min-height: ${minHeight}px;` : ''} flex: 1;" />

<input type="hidden" data-harmony-id="Java code" bind:value />
