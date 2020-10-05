<script>
  import { onMount } from 'svelte'

  import { navigate } from 'svelte-routing'
  import Button from './Button.svelte'
  import Logo from './Logo.svelte'

  onMount(() => {
    localStorage.removeItem('student_id')
  })
</script>

<main class="h-full w-full bg-gray-800 text-white text-center">
  <Logo />
  <section
    class="text-left mx-auto my-4"
    style="max-width: 32em; font-size: 19px;"
    data-harmony-id="Message">
    <p>Welcome to JavaTutor.</p>
    <p>This is a research project ...</p>
    <p>
      Please contact ... if you would like to participate, or if you have any
      questions or requests.
    </p>
  </section>
  <div class="absolute right-0 bottom-0 text-sm">
    <a href="/instructor" data-harmony-id="Instructor login">
      Instructor login
    </a>
  </div>
</main>
