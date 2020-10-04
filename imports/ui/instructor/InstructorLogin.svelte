<script>
  import { onMount } from 'svelte'

  let input
  onMount(() => {
    input.focus()
  })

  let errorMessage

  function logIn() {
    Meteor.loginWithPassword('instructor', input.value, (error, result) => {
      if (error) {
        errorMessage = error.reason || error.message
        return
      }
    })
  }
</script>

<div class="pt-8 pb-12 px-12 text-black bg-gray-500">
  <h2 class="mt-0 text-lg font-bold">Instructor login</h2>
  Password
  <br />
  <input
    bind:this={input}
    type="password"
    data-harmony-id="Password"
    on:keypress={e => {
      if (e.key === 'Enter') logIn()
    }}
    class="text-black p-2" />
  <button data-harmony-id="OK" on:click={logIn}>OK</button>
  {#if errorMessage}
    <p data-harmony-id="Error message" class="text-red-800">{errorMessage}</p>
  {/if}
</div>
