<script>
  import { navigate } from 'svelte-routing'

  import Button from './Button.svelte'

  import Logo from './Logo.svelte'

  export let experiments
</script>

<main class="h-full w-full dark:text-white text-center">
  <Logo />
  <section
    class="text-left mx-auto my-4 message"
    style="max-width: 32em; font-size: 19px;"
    data-harmony-id="Message">
    <p class="mt-8 mb-6">Please choose your classroom:</p>
    <div class="my-4 flex justify-center">
      {#each experiments as experiment}
        <span class="mx-4 my-3 text-xl">
          <a
            href="/experiment/${experiment._id}"
            class="text-orange-400 hover:underline"
            data-harmony-id="Experiment {experiment.title}">
            {experiment.title}
          </a>
        </span>
      {/each}
    </div>
  </section>
</main>
