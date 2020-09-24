<script>
  import { Router, Route } from 'svelte-routing'
  import Code from './Code.svelte'
  import Welcome from './Welcome.svelte'
</script>

<main class="h-screen">
  <Router>
    <Route path="/" component={Welcome} />
    <Route path="/code" component={Code} />
  </Router>
</main>
