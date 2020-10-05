<script>
  let active = false
  let showTooltip = false
  async function raiseHand() {
    showTooltip = false
    active = true
  }
  function cancel() {
    showTooltip = false
    active = false
  }
</script>

<div
  class="helpButtonContainer"
  on:mouseover={() => {
    showTooltip = true
  }}
  on:mouseout={() => {
    showTooltip = false
  }}>

  <div class="tooltip" class:visible={showTooltip}>
    {#if !active}
      Ask for help
    {:else}
      Asked for help.
      <button
        class="text-primary hover:underline"
        on:click|preventDefault={cancel}>
        Cancel
      </button>
    {/if}
  </div>
  <button class="hand" on:click|preventDefault={raiseHand} class:active />
</div>

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
    background: #3e3e3e url('./hand.png') no-repeat 50% 50%;
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
  button.active {
    background-color: #ffffff;
  }
  .tooltip {
    white-space: nowrap;
    background-color: #2b2b2b;
    color: #ddd;
    border-radius: 2px;
    display: inline-block;
    font-size: 0.9em;
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translate(0, -50%);
    padding: 0.8em 1em;
    transition: opacity 0.3s;
  }
  .tooltip:not(.visible) {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0s;
  }
</style>
