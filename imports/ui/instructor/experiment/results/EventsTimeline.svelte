<script>
  const d3 = require('d3/build/d3')
  window.d3 = d3
  import eventDrops from 'event-drops'

  export let eventsByType
  $: data = Object.entries(eventsByType).map(([name, data]) => ({ name, data }))
  let el, tooltipEl
  let sel
  let oldData
  export let currentEvent = undefined
  $: if ((el && data && !sel) || (oldData && oldData != data)) {
    // fix redundantly collected events
    const hc = eventsByType['Highlighted code from teacher']
    if (hc)
      for (let i = 1; i < hc.length; ++i)
        if (hc[i].value === hc[i - 1].value) hc.splice(i--, 1)

    const allDates = []
      .concat(...data.map(({ data }) => data))
      .map(d => d.createdAt)
    const min = d3.min(allDates),
      max = d3.max(allDates)
    const chart = eventDrops({
      d3,
      metaballs: false,
      drop: {
        date: d => d.createdAt,
        onMouseOver,
        onMouseOut
      },
      line: { height: 30 },
      range: { start: min, end: max }
    })
    sel = d3.select(el).data([data]).call(chart)
    window.chart = chart
    data = oldData
  }

  function onMouseOver(event) {
    currentEvent = event
    if (event.value === undefined) return onMouseOut(event)
    tooltip
      .transition()
      .duration(200)
      .style('opacity', 1)
      .style('pointer-events', 'auto')

    tooltip
      .text(event.value)
      .style('left', `${d3.event.clientX - 30}px`)
      .style('top', `${d3.event.clientY + 20}px`)
  }
  function onMouseOut() {
    tooltip
      .transition()
      .duration(500)
      .style('opacity', 0)
      .style('pointer-events', 'none')
  }
  $: tooltip =
    tooltipEl &&
    d3.select(tooltipEl).style('opacity', 0).style('pointer-events', 'auto')
</script>

<div class="tooltip" bind:this={tooltipEl} />
<main bind:this={el} />

<style>
  .tooltip {
    position: fixed;
    background: #fff;
    border: 3px solid #e7e7e7;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    width: 30rem;
    line-height: 1.4rem;
  }

  .tooltip::before {
    content: '';
    display: block;
    position: absolute;
    top: -0.65rem;
    width: 1rem;
    height: 1rem;
    background: #fff;
    border: 3px solid #e7e7e7;
    border-width: 3px 0 0 3px;
    transform: rotate(45deg);
    z-index: 1;
  }

  .tooltip.left::before {
    left: 1.65rem;
  }

  .tooltip.right::before {
    right: 1.65rem;
  }
</style>
