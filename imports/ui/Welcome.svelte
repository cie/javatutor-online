<script>
  import { navigate } from 'svelte-routing'
  function start() {
    navigate('/code')
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
  <button
    class="bg-green-600 text-white px-4 py-3 rounded-lg"
    on:click={start}
    data-harmony-id="Start button">
    Let's start!
  </button>
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
