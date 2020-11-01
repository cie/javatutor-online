<script>
  import marked from 'marked'

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
  let x = 1
  let confirmed = false
</script>

<main class="h-full w-full bg-gray-800 text-white text-center">
  <Logo />
  {#if !confirmed}
    <section
      class="text-left mx-auto my-4 message"
      style="max-width: 32em; font-size: 19px;"
      data-harmony-id="Message">
      {@html marked(`
# Introduction and Agreement

Hello and Welcome to the Java Tutor, a research project for programming lab sessions.

The purpose of this research project is to help students during their
introductory programming lab session.

The procedure involves you using the Java Tutor project to solve and code
certain predefined programming exercises that are available in the course lab
manual. After you are done, a short survey will be presented to you to fill
and the researcher will conduct an interview with you in order to collect
information and find out about your level of satisfaction about the reach
project usage. The estimated time of participation is around 60 min.

Your work will be recorded and collected for later use of the study. Your responses will be confidential. All data is stored in a password protected electronic format. To help protect your confidentiality, the surveys will not contain information that will personally identify you. The results of this study will be used for scholarly purposes only. 

If you have any questions about the research study, please contact the researcher, Samar Mahrous, at smahrous000${x}@stu.kau.edu.sa

By clicking on the "agree" button below indicates that:

* You have read the above information
* you voluntarily agree to participate		
      `)}
    </section>
    <Button
      on:click={() => (confirmed = true)}
      data-harmony-id="Confirm button">
      I agree to participate in the study
    </Button>
    <div class="mb-8" />
  {:else}
    <section
      class="text-left mx-auto my-4 message"
      style="max-width: 32em; font-size: 19px;">
      Please choose a nickname. This doesn't have to be your real name.
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
    <Button on:click={start} data-harmony-id="Start button">
      Let's start!
    </Button>
  {/if}
  <div class="absolute right-0 bottom-0 text-sm">
    <a href="/instructor" data-harmony-id="Instructor login">
      Instructor login
    </a>
  </div>
</main>

<style>
  .message :global(p) {
    margin-bottom: 1em;
  }
  .message :global(h1) {
    text-align: center;
    margin-bottom: 0.8em;
    font-size: 1.6em;
  }
</style>
