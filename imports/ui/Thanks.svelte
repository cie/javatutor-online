<script>
  import { onMount } from 'svelte'

  let x = '1'
  onMount(() => {
    localStorage.clear()
  })
</script>

<main
  class="h-full w-full dark:text-white flex flex-col justify-center items-center">
  <section class="text-center mx-auto my-4">
    <p style="font-size: 32px; max-width: 32em;">
      We are done. Thank you for your participation!
    </p>
    <p class="my-3 mx-auto" style="max-width: 32em;">
      If you have any questions or requests, don't hesitate to contact
      Samar&nbsp;Mahrous at smahrous000{1}@stu.kau.edu.sa
    </p>
  </section>
</main>
