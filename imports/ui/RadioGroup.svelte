<script>
  export let name
  export let value = null
</script>

<div class="flex justify-center my-3">
  {#each [1, 2, 3, 4, 5] as i}
    <label class="flex flex-col items-center cursor-pointer">
      <input
        type="radio"
        class="hidden"
        {name}
        checked={value === i}
        on:click={() => (value = i)} />
      <b class="mb-1 mx-3" />
      <span>{i}</span>
    </label>
  {/each}
</div>

<style>
  b {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid white;
    transition: border-width 300ms, border-color 300ms;
  }
  input:checked + b {
    border: 11px solid #eaad12;
  }
</style>
