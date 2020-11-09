<script>
  import CodeWindow from '../CodeWindow.svelte'
  export let events
  $: someEvents = events.length > 0
  $: maxSec = someEvents && events[events.length - 1].sec - events[0].sec
  let currentSec = -1
  let currentEvent
  $: {
    console.log('computing currentEvent')
    if (currentSec == -1) {
      console.log('-1')
      currentEvent = events[events.length - 1]
    } else {
      currentEvent = events[0]
      for (const e of events) {
        if (e.sec > currentSec + events[0].sec) break
        currentEvent = e
      }
      console.log('currentEvent', currentEvent)
    }
  }
  $: sec = currentSec !== -1 ? currentSec : maxSec
  let hintIntervals
  $: {
    hintIntervals = []
    for (let i = 0; i < events.length - 1; ++i) {
      if (!events[i].hintSource && events[i + 1].hintSource) {
        const start = i + 1
        do {
          ++i
        } while (events[i].hintSource && i < events.length - 1)
        hintIntervals.push({
          start: events[start].sec - events[0].sec,
          length: events[i].sec - events[start].sec
        })
      }
    }
  }
</script>

<div class="panel">
  {#if events.length}
    <CodeWindow code={currentEvent.code} />
    {#if currentEvent.hintSource}
      <div class="hint">{currentEvent.hintSource.replace(/^!/, '')}</div>
    {/if}
    {#if someEvents}
      <ion-range
        min="0"
        max={maxSec}
        step="1"
        pin="true"
        value={sec}
        on:ionChange={e => (currentSec = e.detail.value === maxSec ? -1 : e.detail.value)} />
      <div class="eventMarkers">
        {#each hintIntervals as int}
          <span
            class="eventMarker"
            style="left: {(int.start / maxSec) * 100}%; width: {(int.length / maxSec) * 100}%" />
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .panel {
    position: relative;
  }
  .hint {
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: rgba(255, 245, 0, 0.1);
    border: 1px solid rgb(40, 40, 40);
    border-radius: 10px;
    max-width: 250px;
    padding: 6px 8px;
  }
  ion-range {
    padding: 0;
  }
  .eventMarkers {
    z-index: 0;
    position: absolute;
    bottom: 21px;
    left: 0;
    right: 0;
  }
  .eventMarker {
    position: absolute;
    width: 12px;
    height: 12px;
    left: 40px;
    top: 0;
    transform: translate(6px, -50%);
    border-radius: 100px;
    background: yellow;
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
    pointer-events: none;
    opacity: 0.4;
    box-sizing: content-box;
  }
</style>
