<script>
  const d3 = require('d3/dist/d3')
  import eventDrops from 'event-drops'

  export let eventsByType
  const chart = eventDrops({
    d3,
    drop: {
      date: d => d.createdAt
    }
  })
  $: data = Object.entries(eventsByType).map(([name, data]) => ({ name, data }))
  let el
  $: if (el && data) {
    console.log(data)
    d3.select(el).data([data]).call(chart)
  }
</script>

<main bind:this={el} />
