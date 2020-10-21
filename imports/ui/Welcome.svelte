<script>
  import { onMount } from 'svelte'

  import { navigate } from 'svelte-routing'
  import Button from './Button.svelte'
  import Logo from './Logo.svelte'

  export let experiment_id

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
    Meteor.call('startSession', { nickname, experiment_id }, (err, result) => {
      if (err) {
        errorMessage = err.reason || err.message
        return
      }
      const { student_id, group } = result
      Meteor.subscribe('Students_myself', student_id)
      localStorage.setItem('student_id', student_id)
      localStorage.setItem('nickname', nickname)
      localStorage.setItem('group', group)
      navigate('/code')
    })
  }
</script>

<main class="h-full w-full bg-gray-800 text-white text-center">
  <Logo />
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
