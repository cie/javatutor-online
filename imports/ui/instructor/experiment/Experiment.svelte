<script>
  import { useTracker } from 'meteor/rdb:svelte-meteor-data'
  import { Route, Router } from 'svelte-routing'
  import Redirect from '../../Redirect.svelte'
  import Gateways from '../Gateways.svelte'
  import Classroom from './classroom/Classroom.svelte'
  import Results from './results/Results.svelte'
  import Tab from './Tab.svelte'
  import Tasks from './tasks/Tasks.svelte'
  export let experiment_id
  $: EXPERIMENT = useTracker(() => Experiments.findOne(experiment_id))
  $: experiment = $EXPERIMENT
  function toggleActive(active) {
    if (
      !confirm(
        `Are you sure you want to ${active ? 'start' : 'stop'} the experiment?`
      )
    )
      return
    Experiments.update(experiment_id, { $set: { active } })
  }
</script>

{#if experiment}
  <main>
    <nav class="flex">
      <a
        class="text-primary hover:underline py-1 px-2 my-2"
        data-harmony-id="Experiments link"
        href="/instructor">
        Experiments
      </a>
      <span class="py-1 px-2 my-2">‣</span>
      <span class="py-1 px-2 my-2 mr-8">{experiment.title}</span>
      <Router>
        <Route path="/:currentTab" let:params={p}>
          <Tab
            id="tasks"
            title="Tasks"
            {experiment_id}
            currentTab={p.currentTab} />
          <Tab
            id="classroom"
            title="Classroom"
            {experiment_id}
            currentTab={p.currentTab} />
          <Tab
            id="results"
            title="Results"
            {experiment_id}
            currentTab={p.currentTab} />
        </Route>
      </Router>
      <ion-toggle
        class="ml-8 my-2"
        size="large"
        color="success"
        checked={!!experiment.active}
        on:ionChange={event => toggleActive(event.detail.checked)} />
      <span class="my-2 py-1">Active</span>
    </nav>
    <Router>
      <Route path="tasks" component={Tasks} {experiment_id} />
      <Route path="classroom" component={Classroom} {experiment_id} />
      <Route path="results" component={Results} {experiment_id} />
      <Route>
        <Redirect to="/instructor/experiments/{experiment_id}/tasks" />
      </Route>
    </Router>
  </main>
  <Gateways {experiment_id} />
{/if}

<style>
  main {
    min-width: 100%;
    min-height: 100vh;
    padding: 2px 5px;
    display: flex;
    flex-direction: column;
  }
  ion-toggle {
    width: 40px;
  }
</style>
