<script>
  import { tick } from 'svelte'
  import trackEvent from './trackEvent'
  export let code, task_id
  let active = false
  let textarea
  let problemMessage = ''
  let sent
  const student_id = localStorage.getItem('student_id')
  async function askForHelp() {
    if (active) return
    active = true
    sent = false
    problemMessage = ''
    await tick()
    textarea.focus()
    trackEvent({ type: 'Ask for help', code })
    Meteor.call('askForHelp', { student_id, task_id })
  }
  function cancelHelp() {
    active = false
    trackEvent({ type: 'Cancel help', code })
    Meteor.call('cancelHelp', { student_id })
  }
  async function edit() {
    sent = false
    await tick()
    textarea.focus()
  }
  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendProblemMessage()
    }
  }
  async function sendProblemMessage() {
    sent = true
    trackEvent({ type: 'Send problem message', value: problemMessage, code })
    Meteor.call('sendProblemMessage', { student_id, problemMessage, task_id })
  }
</script>

<div class="helpButtonContainer" class:active>

  <div class="tooltip rounded-sm">
    {#if !active}
      Ask for help
    {:else}
      Explain your problem:
      <div>
        <textarea
          bind:value={problemMessage}
          bind:this={textarea}
          on:keydown={handleKeydown}
          readonly={sent}
          class:sent
          rows="2"
          cols="38" />
      </div>
      <div class="text-right">
        {#if !sent}
          <button
            class="text-primary hover:underline mr-2"
            on:click|preventDefault={sendProblemMessage}>
            Send
          </button>
        {:else}
          <button
            class="text-primary hover:underline mr-2"
            on:click|preventDefault={edit}>
            Edit
          </button>
        {/if}
        <button
          class="text-primary hover:underline"
          on:click|preventDefault={cancelHelp}>
          Cancel
        </button>
      </div>
    {/if}
  </div>
  <button class="hand" on:click|preventDefault={askForHelp} class:active />
</div>

<style>
  textarea {
    background: rgba(255, 255, 255, 0.14);
    outline: none;
    padding: 0.2em 0.4em;
    vertical-align: middle;
  }
  textarea.sent {
    background: transparent;
  }
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
    background: #3e3e3e url('/hand.png') no-repeat 50% 50%;
    background-size: 70% 70%;
    position: relative;
    transform: rotate(15deg);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    transition: cubic-bezier(0.215, 0.61, 0.355, 1) 300ms;
    transition-property: transform, background-position, background-color;
    outline: none;
    opacity: 0.7;
  }
  .helpButtonContainer:not(:hover) > .hand {
    opacity: 0.7;
  }
  .hand:hover,
  .hand:active,
  .hand:focus,
  .hand.active {
    transform: rotate(8deg);
    background-position: 55% 30%;
    opacity: 0.7;
  }
  .tooltip {
    white-space: nowrap;
    background-color: #2b2b2b;
    color: #ddd;
    display: inline-block;
    font-size: 0.9em;
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translate(0, -50%);
    padding: 0.8em 1em;
    transition: opacity 0.3s;
  }
  .helpButtonContainer:not(:hover):not(.active) .tooltip {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0s;
  }
  .helpButtonContainer:not(.active) .tooltip {
    pointer-events: none;
  }
</style>
