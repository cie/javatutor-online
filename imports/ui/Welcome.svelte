<script>
  import { onMount } from 'svelte'

  import { navigate } from 'svelte-routing'
  import Button from './Button.svelte'
  import InstructorLoginLink from './InstructorLoginLink.svelte'
  import Logo from './Logo.svelte'

  export let experiment_id

  onMount(() => {
    if (localStorage.getItem('student_id')) {
      navigate(`/experiment/${experiment_id}/code`, { replace: true })
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
      navigate(`/experiment/${experiment_id}/code`)
    })
  }
</script>

<main
  class="h-full w-full dark:text-white text-center bg-gray-200
  dark:bg-transparent ">
  <Logo />
  <section
    class="text-left mx-auto my-4 message"
    style="max-width: 32em; font-size: 19px;">
    Please enter your name with your university id (e.g. Bob_1234567):
  </section>
  <p class="my-2">
    <input
      class="text-black p-2 rounded-sm border-solid border border-gray-700"
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
  <InstructorLoginLink />
</main>
