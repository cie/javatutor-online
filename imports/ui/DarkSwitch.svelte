<script context="module">
  import { writable } from 'svelte/store'
  export const DARK = writable(
    localStorage.getItem('dark') === undefined
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : localStorage.getItem('dark') === 'true'
  )
</script>

<script>
  $: dark = $DARK
  $: localStorage.setItem('dark', dark)
  $: document.body.classList.toggle('dark', dark)
</script>

<nav
  class="absolute top-0 right-0 px-2 mr-8 dark:text-white z-30 dark:bg-gray-800
  bg-gray-200 opacity-25 hover:opacity-75 rounded-full">
  <ion-icon name="sunny" class="align-middle" />
  <ion-toggle
    class="align-middle"
    size="large"
    color="medium"
    checked={dark}
    on:ionChange={() => ($DARK = !$DARK)} />
  <ion-icon name="moon" class="align-middle" />
</nav>
