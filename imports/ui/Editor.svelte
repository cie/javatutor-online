<script>
  import { onMount, onUnmout } from 'svelte'
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
  onMount(setupEditor)
  function setupEditor() {
    if (typeof monaco === 'undefined') {
      setTimeout(setupEditor, 10)
      return
    }
    monaco.editor.setTheme('vs-dark')
    editor = window.editor = monaco.editor.create(editorEl, editorOptions)
    monaco.editor.setModelLanguage(editor.getModel(), 'java')

    const dispose = setupLanguageClient(editor)
    onUnmout(dispose)

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
