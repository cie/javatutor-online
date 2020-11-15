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
            currentTab={p.currentTab}
            disabled={!experiment.active}
            disabledMessage="Experiment is not active" />
          <Tab
            id="results"
            title="Results"
            {experiment_id}
            currentTab={p.currentTab}
            disabled={experiment.active}
            disabledMessage="Experiment is active" />
        </Route>
      </Router>
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
