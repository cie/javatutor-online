<script>
  import { useTracker } from 'meteor/rdb:svelte-meteor-data'
  import { Route, Router } from 'svelte-routing'
  import Redirect from '../Redirect.svelte'
  import Gateways from './Gateways.svelte'
  import Students from './Students.svelte'
  import Tab from './Tab.svelte'
  import Tasks from './Tasks.svelte'
  export let experiment_id
  $: EXPERIMENT = useTracker(() => Experiments.findOne(experiment_id))
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

{#if $EXPERIMENT}
  <main>
    <nav class="flex">
      <a
        class="text-primary hover:underline py-1 px-2 my-2"
        data-harmony-id="Experiments link"
        href="/instructor">
        Experiments
      </a>
      <span class="py-1 px-2 my-2">‣</span>
      <span class="py-1 px-2 my-2 mr-8">{$EXPERIMENT.title}</span>
      <Router>
        <Route path="/:currentTab" let:params={p}>
          <Tab
            id="tasks"
            title="Tasks"
            {experiment_id}
            currentTab={p.currentTab} />
          <Tab
            id="students"
            title="Students"
            {experiment_id}
            currentTab={p.currentTab} />
        </Route>
      </Router>
      <ion-toggle
        class="ml-8 my-2"
        size="large"
        color="success"
        checked={!!$EXPERIMENT.active}
        on:ionChange={event => toggleActive(event.detail.checked)} />
      <span class="my-2 py-1">Active</span>
    </nav>
    <Router>
      <Route path="tasks" component={Tasks} {experiment_id} />
      <Route path="students" component={Students} {experiment_id} />
      <Route>
        <Redirect to="/instructor/experiments/{experiment_id}/tasks" />
      </Route>
    </Router>
  </main>
  <Gateways {experiment_id} />
{/if}

<style>
  main {
    min-width: 76vw;
    min-height: 90vh;
  }
  ion-toggle {
    width: 40px;
  }
</style>
