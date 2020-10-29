<script>
  import Editor from '../../Editor.svelte'
  import Node from './Node.svelte'
  import * as xpath from 'xpath-ts'

  let code = '',
    query = '/*'
  /** @type Document */
  let doc
  let selected = []
  let error
  /** @type monaco.editor.IStandaloneCodeEditor */
  let editor

  function updateSrcML({ detail: { value } }) {
    code = value
    Meteor.call('getSrcML', value, (err, res) => {
      if (err) {
        console.error(err)
        return
      }
      doc = new DOMParser().parseFromString(res, 'application/xml')
      updateMatch()
    })
  }
  let oldDecorations = []
  function updateMatch() {
    try {
      selected = xpath.select(query, doc)
      error = null
      if (editor) {
        const decorations = selected
          .map(n => {
            if (!n.getAttributeNS) return null
            const start = n.getAttributeNS(
              'http://www.srcML.org/srcML/position',
              'start'
            )
            const end = n.getAttributeNS(
              'http://www.srcML.org/srcML/position',
              'end'
            )
            if (!start || !end) return null
            const [startLineNumber, startColumn] = start.split(':')
            const [endLineNumber, endColumn] = end.split(':')
            return {
              options: { className: 'hint-editor-selected' },
              range: {
                startLineNumber,
                startColumn,
                endLineNumber,
                endColumn: +endColumn + 1
              }
            }
          })
          .filter(Boolean)
        console.log(decorations)
        oldDecorations = editor
          .getModel()
          .deltaDecorations(oldDecorations, decorations)
      }
    } catch (e) {
      console.error(e)
      error = e.message
    }
  }
</script>

<div class="text-left">
  <h2>Code</h2>
  <div style="width:95%">
    <Editor bind:editor value={code} on:change={updateSrcML} />
  </div>

  <h2>XPath</h2>
  <textarea
    cols="50"
    rows="3"
    class="text-gray-900"
    bind:value={query}
    on:input={updateMatch}
    class:bg-red-300={error} />
  <p>
    {#if error}{error}{:else}&nbsp;{/if}
  </p>

  <h2>Tree</h2>
  {#if doc}
    <Node node={doc} {selected} />
  {/if}

</div>

<style>
  :global(.hint-editor-selected) {
    background: #8d6103;
  }
</style>
