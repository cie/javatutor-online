<script>
  import { Router, Route, navigate } from 'svelte-routing'
  import Code from './Code.svelte'
  import Instructor from './instructor/Instructor.svelte'
  import Logout from './Logout.svelte'
  import Welcome from './Welcome.svelte'
  import Home from './Home.svelte'
  import { onMount } from 'svelte'
  import Questionnaire from './Questionnaire.svelte'
  import Thanks from './Thanks.svelte'
  import Redirect from './Redirect.svelte'
  import Consent from './Consent.svelte'
  import ExperimentChooser from './ExperimentChooser.svelte'
  import DarkSwitch, { DARK } from './DarkSwitch.svelte'

  const student_id = localStorage.getItem('student_id')
  if (student_id) {
    Meteor.subscribe('Students_myself', student_id)
  }

  let experiments = undefined
  onMount(() => {
    Meteor.call('getActiveExperiments', (err, exps) => {
      if (err) alert(err.reason || err.message)
      experiments = window.experiments = exps
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
  class="h-screen dark:bg-gray-800 overflow-auto relative"
  on:click|capture={handleLinks}
  data-harmony-id="Page">
  <DarkSwitch />
  {#if experiments}
    <Router>
      {#if experiments.length === 0}
        <Route path="/" component={Home} />
      {:else}
        <Route path="/" component={Consent} />
      {/if}
      <Route path="/experiment/*">
        <Router>
          {#if experiments.length > 1}
            <Route path="/" component={ExperimentChooser} {experiments} />
          {:else}
            <Route path="/">
              <Redirect to="/experiment/{experiments[0]._id}" />
            </Route>
          {/if}
          <Route path="/:experiment_id/*" let:params={{ experiment_id }}>
            <Router>
              <Route path="/code" component={Code} {experiment_id} />
              <Route path="/" component={Welcome} {experiment_id} />
            </Router>
          </Route>
        </Router>
      </Route>
      <Route path="/instructor/*" component={Instructor} />
      <Route path="/questionnaire" component={Questionnaire} />
      <Route path="/thanks" component={Thanks} />
      <Route path="/logout" component={Logout} />
    </Router>
  {/if}

</main>
