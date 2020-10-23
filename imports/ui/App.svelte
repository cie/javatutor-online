<script>
  import { Router, Route, navigate } from 'svelte-routing'
  import Code from './Code.svelte'
  import Instructor from './instructor/Instructor.svelte'
  import Logout from './Logout.svelte'
  import Welcome from './Welcome.svelte'
  import Home from './Home.svelte'
  import { onMount } from 'svelte'
  import { useTracker } from 'meteor/rdb:svelte-meteor-data'
  import Questionnaire from './Questionnaire.svelte'
  import Thanks from './Thanks.svelte'

  const student_id = localStorage.getItem('student_id')
  if (student_id) {
    Meteor.subscribe('Students_myself', student_id)
  }

  let experiment = undefined
  onMount(() => {
    Meteor.call('getActiveExperiment', (err, exp) => {
      if (err) alert(err.reason || err.message)
      experiment = exp || null
    })
  })

  function handleLinks(e) {
    if (e.target.matches('a[href^="/"]')) {
      e.preventDefault()
      e.stopPropagation()
      navigate(e.target.href)
    }
  }
</script>

<main
  class="h-screen overflow-auto bg-gray-800"
  on:click|capture={handleLinks}
  data-harmony-id="Page">
  <Router>
    {#if experiment !== undefined}
      {#if experiment === null}
        <Route path="/code" component={Home} />
        <Route path="/" component={Home} />
      {:else}
        <Route path="/code" component={Code} experiment_id={experiment._id} />
        <Route path="/" component={Welcome} experiment_id={experiment._id} />
      {/if}
    {/if}
    <Route path="/instructor/*" component={Instructor} />
    <Route path="/questionnaire" component={Questionnaire} />
    <Route path="/thanks" component={Thanks} />
    <Route path="/logout" component={Logout} />
  </Router>
</main>
