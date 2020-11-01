<script>
  function goodHint() {
    trackEvent({ type: 'Good hint', code })
  }
  function badHint() {
    trackEvent({ type: 'Bad hint', code })
  }
</script>

<div
  class="goodHintButtons flex justify-end items-center"
  style="opacity: 0.5; margin-bottom: -8px; margin-right: -8px">
  <small class="goodHint text-xs mr-1">Good hint?</small>
  <button class="p-1 focus:outline-none" on:click={goodHint}>
    <i class="fa fa-smile-o" />
  </button>
  <button class="p-1 focus:outline-none" on:click={badHint}>
    <i class="fa fa-frown-o" />
  </button>
</div>

<style>
  .goodHintButtons:not(:hover) > .goodHint {
    visibility: hidden;
  }
</style>
