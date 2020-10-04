<script>
  import { useTracker } from 'meteor/rdb:svelte-meteor-data'
  import { Route, Router } from 'svelte-routing'
  import Experiment from './Experiment.svelte'
  import ExperimentList from './ExperimentList.svelte'
  import InstructorLogin from './InstructorLogin.svelte'
  $: LOGGED_IN = useTracker(() => !!Meteor.connection.userId())
</script>

<div
  class="h-full flex flex-col bg-gray-900 text-white justify-center items-center">
  <Router>
    {#if !$LOGGED_IN}
      <InstructorLogin />
    {:else}
      <Route path="/experiments/:experiment_id/*" component={Experiment} />
      <Route path="/" component={ExperimentList} />
    {/if}
  </Router>
</div>
