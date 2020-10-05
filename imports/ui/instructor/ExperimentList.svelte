<script>
  import { navigate } from 'svelte-routing'
  import Button from '../Button.svelte'

  function removeAllExperiments() {
    Experiments.find()
      .fetch()
      .forEach(e => Experiments.remove(e._id))
  }

  $: EXPERIMENTS = Experiments.find()

  let newExperimentTitle
  function newExperiment() {
    const title = newExperimentTitle
    if (!title || !title.trim()) return
    Experiments.insert({ title, active: true }, (err, _id) => {
      if (err) {
        return
      }
      navigate(`/instructor/experiments/${_id}`)
    })
  }
</script>

<nav data-harmony-id="Experiments" class="pb-4">
  {#each $EXPERIMENTS as { title, _id }}
    <p>
      <a
        class="hover:underline text-primary"
        href="/instructor/experiments/{_id}"
        data-harmony-id={title}>
        {title}
      </a>
    </p>
  {:else}
    <p>No experiments</p>
  {/each}
</nav>
<p>
  <input
    data-harmoy-id="New experiment title"
    bind:value={newExperimentTitle}
    placeholder="New experiment's title"
    on:keypress={e => {
      if (e.key == 'Enter') newExperiment()
    }}
    class="text-black p-2 rounded-sm" />
  <Button data-harmony-id="Create experiment" on:click={newExperiment}>
    Create experiment
  </Button>
</p>

<input
  type="hidden"
  data-harmony-id="All experiments"
  on:change={e => {
    if (e.target.value === 'removed') removeAllExperiments()
  }} />
