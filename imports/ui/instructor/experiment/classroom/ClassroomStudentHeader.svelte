<script>
  import { createEventDispatcher } from 'svelte'
  export let student
  export let active
  export let hotkey = null
  const dispatch = createEventDispatcher()
  function bodyKeypress(e) {
    if (e.key == hotkey) dispatch('select')
  }
</script>

<svelte:body on:keypress={bodyKeypress} />

<main
  class="hover:bg-{student.helpAsked ? 'primary-800' : 'gray-800'}"
  class:bg-gray-800={active && !student.helpAsked}
  class:dark:bg-gray-600={active && !student.helpAsked}
  class:bg-primary-800={active && student.helpAsked}
  class:bg-primary-600={student.helpAsked && !active}
  on:click={() => dispatch('select')}>
  <h1>{student.nickname}</h1>

  <span class="hotkey">
    {#if hotkey != null}
      <span class="keystroke">{hotkey}</span>
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
