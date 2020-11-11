<button
  class="bg-green-600 text-white px-4 py-3 rounded-lg"
  on:click
  {...$$props}>
  <slot />
</button>

<style>
  button {
    color: white; /* text-white doesn't work -- why? */
    box-shadow: 1px 2px 6px -2px inset rgba(255, 255, 255, 0.9),
      -1px -2px 5px -2px inset rgba(0, 0, 0, 0.6),
      1px 3px 5px -1px rgba(0, 0, 0, 0.4);
  }
</style>
