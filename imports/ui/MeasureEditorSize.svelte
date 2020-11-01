<script>
  export let editor
  export let editorWidth = 600
  function measure() {
    if (!editor) return
    editorWidth = editor.getDomNode().offsetWidth
  }
  let measureInterval
  // for some reason this does not work with window on:resize...
  onMount(() => (measureInterval = setInterval(measure, 500)))
  onDestroy(() => clearInterval(measureInterval))
</script>
