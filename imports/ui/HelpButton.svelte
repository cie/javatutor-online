<script>
  import { tick } from 'svelte'

  import { CHAT } from './instructor/ChatBox.svelte'
  const student_id = localStorage.getItem('student_id')
  function toggleChat() {
    $CHAT = !$CHAT
    tick().then(() => document.querySelector('#chatMessage').focus())
  }
</script>

{#if !$CHAT}
  <div class="helpButtonContainer">
    <div class="tooltip">Chat with instructor</div>
    <button class="hand" on:click|preventDefault={toggleChat} />
  </div>
{/if}

<style>
  .helpButtonContainer * {
    box-sizing: border-box;
  }
  .helpButtonContainer {
    position: absolute;
    right: 30px;
    bottom: 15px;
    padding-left: 5px; /* the margin between the button and the tooltip */
  }
  .hand {
    width: 70px;
    height: 70px;
    border-radius: 35px;
    cursor: pointer;
    border: none;
    background: #7e8593 url('/hand.png') no-repeat 50% 50%;
    background-size: 70% 70%;
    position: relative;
    transform: rotate(15deg);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    transition: cubic-bezier(0.215, 0.61, 0.355, 1) 300ms;
    transition-property: transform, background-position, background-color;
    outline: none;
    opacity: 0.7;
  }
  :global(.dark) .hand {
    background-color: #3e3e3e;
  }
  .helpButtonContainer:not(:hover) > .hand {
    opacity: 0.7;
  }
  .hand:hover,
  .hand:active,
  .hand:focus {
    transform: rotate(8deg);
    background-position: 55% 30%;
    opacity: 0.7;
  }
  .tooltip {
    white-space: nowrap;
    background-color: #e2e8f0;
    color: #2e2e2e;
    display: inline-block;
    font-size: 0.9em;
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translate(0, -50%);
    padding: 0.8em 1em;
    transition: opacity 0.3s;
  }
  :global(.dark) .tooltip {
    background-color: #2b2b2b;
    color: #ddd;
  }
  .helpButtonContainer:not(:hover) .tooltip {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0s;
  }
  .helpButtonContainer .tooltip {
    pointer-events: none;
  }
</style>
