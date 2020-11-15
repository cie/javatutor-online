<script>
  import hljs from 'highlight.js'
  import java from 'highlight.js/lib/languages/java'
  import 'highlight.js/styles/github.css'
  hljs.registerLanguage('java', java)

  export let code
</script>

<pre class="codeWindow text-sm">
  <code>
    {@html hljs.highlight('java', code).value}
  </code>
</pre>

<style>
  .codeWindow {
    background-color: rgba(0, 0, 0, 0.02);
    padding: 6px;
    overflow: auto;
  }
</style>
