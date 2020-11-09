<script>
  import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte'
  import setupLanguageClient from './languageClient'
  import trackEvent from './trackEvent'
  export let value
  export let uri

  /** @type monaco.editor.IStandaloneCodeEditor */
  export let editor = undefined

  let editorEl, model
  const minMinHeight = 250
  const margin = 20
  let minHeight = minMinHeight
  const dispatch = createEventDispatcher()

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
  onDestroy(() => disposers.forEach(x => x()))

  function setupEditor() {
    if (typeof monaco === 'undefined') {
      setTimeout(setupEditor, 10)
      return
    }
    monaco.editor.setTheme('vs-dark')
    model = monaco.editor.createModel(value, 'java', uri)
    editor = window.editor = monaco.editor.create(editorEl, {
      ...editorOptions,
      model
    })
    model.onDidChangeContent(() => {
      const value = model.getValue()
      dispatch('change', { value })
      const newMinHeight = Math.max(
        minMinHeight,
        editor.getTopForLineNumber(model.getLineCount() + 1) + margin
      )
      if (minHeight != newMinHeight) {
        minHeight = newMinHeight
        tick().then(() => window.dispatchEvent(new Event('resize')))
      }
    })

    disposers.push(setupLanguageClient(editor))
  }

  function onResize() {
    // ugly hack
    editor._domElement.style.display = 'none'
    editor.layout()
    editor._domElement.style.display = ''
    editor.layout()
  }

  function onWheel(event) {
    if (!editor) return
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
  bind:this={editorEl}
  on:wheel|capture={onWheel}
  style="background: #1e1e1e; min-height: {minHeight}px" />
