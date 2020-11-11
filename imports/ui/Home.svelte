<script>
  import marked from 'marked'

  import { onMount } from 'svelte'

  import { navigate } from 'svelte-routing'
  import Button from './Button.svelte'
  import InstructorLoginLink from './InstructorLoginLink.svelte'
  import Logo from './Logo.svelte'

  onMount(() => {
    localStorage.removeItem('student_id')
  })
  let x = 1
</script>

<main class="h-full w-full dark:text-white text-center">
  <Logo />
  <section
    class="text-left mx-auto my-4 message"
    style="max-width: 32em; font-size: 19px;"
    data-harmony-id="Message">
    {@html marked(`
Hello and Welcome to the Java Tutor, a research project for programming lab sessions.

If you have any questions about the research study, please contact the researcher, Samar Mahrous, at smahrous000${x}@stu.kau.edu.sa
      `)}
  </section>
  <InstructorLoginLink />
</main>

<style>
  .message :global(p) {
    margin-bottom: 1em;
  }
</style>
