<script>
  import { onMount } from 'svelte'

  import { navigate } from 'svelte-routing'
  import Button from './Button.svelte'

  onMount(() => {
    if (localStorage.getItem('student_id')) {
      navigate('/code')
    }
  })

  let errorMessage,
    nickname = ''

  function start() {
    if (!nickname && !nickname.trim()) {
      errorMessage = 'Please enter a nickname'
      return
    }
    Meteor.call('startSession', { nickname }, (err, _id) => {
      if (err) {
        errorMessage = err.reason || err.message
        return
      }
      localStorage.setItem('student_id', _id)
      navigate('/code')
    })
  }
</script>

<main class="h-full w-full bg-gray-800 text-white text-center">
  <h1 class="title">JavaTutor</h1>
  <section
    class="text-left mx-auto my-4"
    style="max-width: 32em; font-size: 19px;"
    data-harmony-id="Message">
    <p>Welcome to JavaTutor.</p>
    This is a research project ...
  </section>
  <p class="my-2">
    <input
      class="text-black p-2 rounded-sm"
      bind:value={nickname}
      data-harmony-id="Nickname"
      placeholder="Nickname"
      on:keydown={e => {
        if (e.key === 'Enter') start()
      }} />
  </p>
  {#if errorMessage}
    <p data-harmony-id="Error message" class="text-red-800">{errorMessage}</p>
  {/if}
  <Button on:click={start} data-harmony-id="Start button">Let's start!</Button>
  <div class="absolute right-0 bottom-0 text-sm">
    <a href="/instructor" data-harmony-id="Instructor login">
      Instructor login
    </a>
  </div>
</main>

<style>
  .title {
    font-family: Rubik, monospace;
    font-style: normal;
    font-weight: normal;
    font-size: 80px;
    text-align: center;

    color: #eaad12;

    text-shadow: 3px 4px 0px #000000, 3px 4px 13px #000000;
  }
</style>
