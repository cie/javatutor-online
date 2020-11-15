<script>
  import { navigate } from 'svelte-routing'
  import Button from '../Button.svelte'

  function removeAllExperiments() {
    Experiments.find()
      .fetch()
      .forEach(e => Experiments.remove(e._id))
  }

  $: EXPERIMENTS = Experiments.find()
  $: experiments = $EXPERIMENTS

  let newExperimentTitle
  function newExperiment() {
    const title = newExperimentTitle
    if (!title || !title.trim()) return
    Experiments.insert({ title, active: false }, (err, _id) => {
      if (err) {
        return
      }
      newExperimentTitle = ''
    })
  }
  function confirmSetActive(experiment, event) {
    const active = !experiment.active
    if (
      !confirm(
        `Are you sure you want to ${active ? 'start' : 'stop'} experiment ${
          experiment.title
        }?`
      )
    )
      event.stopImmediatePropagation()
  }
  function toggleActive(experiment, active) {
    Experiments.update(experiment._id, { $set: { active } })
  }
</script>

<nav data-harmony-id="Experiments" class="pb-4">
  {#each experiments as experiment}
    <p>
      <a
        class="hover:underline text-primary dark:text-"
        href="/instructor/experiments/{experiment._id}"
        data-harmony-id="Experiment {experiment.title}">
        {experiment.title}
      </a>
      <ion-toggle
        class="align-middle"
        size="large"
        color="success"
        checked={experiment.active}
        on:click|capture={event => confirmSetActive(experiment, event)}
        on:ionChange={event => toggleActive(experiment, event.detail.checked)} />
    </p>
  {:else}
    <p>No experiments</p>
  {/each}
</nav>
<p>
  <input
    data-harmony-id="New experiment title"
    bind:value={newExperimentTitle}
    placeholder="New experiment's title"
    on:keypress={e => {
      if (e.key == 'Enter') newExperiment()
    }}
    class="text-black p-2 rounded border-solid border border-gray-700" />
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
