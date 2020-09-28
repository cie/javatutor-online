<script>
  import { Router, Route, navigate } from 'svelte-routing'
  import Code from './Code.svelte'
  import Instructor from './instructor/Instructor.svelte'
  import Logout from './Logout.svelte'
  import Welcome from './Welcome.svelte'

  function handleLinks(e) {
    if (e.target.matches('a[href^="/"]')) {
      e.preventDefault()
      e.stopPropagation()
      navigate(e.target.href)
    }
  }
</script>

<main class="h-screen" on:click|capture={handleLinks} data-harmony-id="Page">
  <Router>
    <Route path="/code" component={Code} />
    <Route path="/instructor/*" component={Instructor} />
    <Route path="/logout" component={Logout} />
    <Route path="/" component={Welcome} />
  </Router>
</main>
