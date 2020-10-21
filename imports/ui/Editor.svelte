<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import setupLanguageClient from './languageClient'
  export let value

  export let editor = undefined
  let editorEl, model
  const dispatch = createEventDispatcher()

  $: if (editor && model) {
    if (model.getValue() !== value) model.setValue(value)
  }

  const editorOptions = {
    minimap: {
      enabled: false
    },
    codelens: false,
    scrollBeyondLastLine: false
  }
  onMount(() => {
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
    model = monaco.editor.createModel(
      value,
      'java',
      'file:///home/cie/git/eclipse.jdt.ls/org.eclipse.jdt.ls.product/target/products/languageServer.product/linux/gtk/x86_64/workspace/asdf/src/Code.java'
    )
    editor = window.editor = monaco.editor.create(editorEl, {
      ...editorOptions,
      model
    })
    model.onDidChangeContent(() => {
      const value = model.getValue()
      dispatch('change', { value })
    })

    disposers.push(setupLanguageClient(editor))

    window.addEventListener('resize', () => {
      // ugly hack
      editor._domElement.style.display = 'none'
      editor.layout()
      editor._domElement.style.display = ''
      editor.layout()
    })
  }
</script>

<div bind:this={editorEl} style="background: #1e1e1e;" />
