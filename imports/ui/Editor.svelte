<script>
  import { onMount, onDestroy } from 'svelte'
  import setupLanguageClient from './languageClient'
  export let value

  let editor, editorEl

  $: if (editor) {
    editor.getModel().setValue(value)
  }

  const editorOptions = {
    minimap: {
      enabled: false
    }
  }
  onMount(() => {
    window.require(['vs/editor/editor.main'], () => {
      setupEditor()
    })
  })
  const dispose = []
  onDestroy(() => dispose.forEach(x => x()))

  function setupEditor() {
    if (typeof monaco === 'undefined') {
      setTimeout(setupEditor, 10)
      return
    }
    monaco.editor.setTheme('vs-dark')
    editor = window.editor = monaco.editor.create(editorEl, editorOptions)
    monaco.editor.setModelLanguage(editor.getModel(), 'java')

    dispose.push(setupLanguageClient(editor))

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
