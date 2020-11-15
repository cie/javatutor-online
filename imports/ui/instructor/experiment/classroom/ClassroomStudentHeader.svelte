<script>
  import { createEventDispatcher } from 'svelte'
  export let student
  export let active
  export let hotkey = null
  const dispatch = createEventDispatcher()
  function bodyKeypress(e) {
    if (keystroke(e) == hotkey) {
      e.preventDefault()
      e.stopPropagation()
      dispatch('select')
    }
  }
  /** @param {KeyboardEvent} e */
  function keystroke(e) {
    return (
      (e.ctrlKey ? 'Ctrl+' : '') +
      (e.shiftKey ? 'Shift+' : '') +
      (e.altKey ? 'Alt+' : '') +
      e.key
    )
  }
  $: unread = false
</script>

<svelte:body on:keydown|capture={bodyKeypress} />

<main
  class="
  {unread ? 'bg-primary-600' : active ? 'bg-gray-400 text-black' : 'dark:text-white '}
  'hover:bg-gray-500 hover-text-black'"
  on:click={() => dispatch('select')}>
  <h1>{student.nickname}</h1>

  <span class="hotkey">
    {#if hotkey != null}
      <span class="text-xs text-gray-500">{hotkey}</span>
    {/if}
  </span>
</main>

<style>
  main {
    width: 100%;
    position: relative;
    cursor: pointer;
    padding: 8px 10px;
  }
  h1 {
    display: inline;
  }
  .hotkey {
    display: block;
    font-size: 1rem;
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
