<script>
  let newMessage
  function handleKeydown() {}
</script>

<main>
  <textarea
    bind:value={newMessage}
    on:keydown={handleKeydown}
    rows="2"
    cols="38" />
</main>

<style>
  main {
    padding: 0.8em;
  }
  textarea {
    background: rgba(255, 255, 255, 0.14);
    outline: none;
    padding: 0.2em 0.4em;
    vertical-align: middle;
  }
</style>
