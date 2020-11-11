<script>
  import { useTracker } from 'meteor/rdb:svelte-meteor-data'
  import { Route, Router } from 'svelte-routing'
  import Experiment from './experiment/Experiment.svelte'
  import ExperimentList from './ExperimentList.svelte'
  import Gateways from './Gateways.svelte'
  import HintEditor from './hint-editor/HintEditor.svelte'
  import InstructorLogin from './InstructorLogin.svelte'
  $: LOGGED_IN = useTracker(() => !!Meteor.connection.userId())
</script>

<div
  class="min-h-full flex flex-col dark:bg-gray-900 bg-gray-100 dark:text-white
  justify-center items-center">
  <Router>
    {#if !$LOGGED_IN}
      <InstructorLogin />
    {:else}
      <Route path="/experiments/:experiment_id/*" component={Experiment} />
      <Route path="/" component={ExperimentList} />
      <Route path="/hint-editor" component={HintEditor} />
    {/if}
  </Router>
</div>
