<script>
  async function raiseHand() {
    active = true
  }
  let active = false
</script>

<div class="helpButtonContainer">
  <button on:click|preventDefault={raiseHand} class:active />
</div>

<style>
  .helpButtonContainer * {
    box-sizing: border-box;
  }
  .helpButtonContainer {
    position: absolute;
    right: 30px;
    bottom: 15px;
  }
  button {
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
    transition-property: transform, background-position;
    outline: none;
  }
  .helpButtonContainer:not(:hover) button {
    opacity: 0.7;
  }
  button:hover {
    transform: rotate(8deg);
    background-position: 55% 30%;
  }
  button:active {
    transform: rotate(8deg);
    background-position: 55% 30%;
  }
  button.active {
    transform: rotate(8deg);
    background-position: 55% 30%;
  }
</style>
