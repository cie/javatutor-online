<script>
  import { Router, Route, navigate } from "svelte-routing";
  import Code from "./Code.svelte";
  function start() {
    navigate("/code");
  }
</script>

<main class="h-screen">
  <Router>
    <Route path="/">
      <div data-harmony-id="Message">Hello</div>
      <button on:click={start} data-harmony-id="Start button">Start</button>
    </Route>
    <Route path="/code" component={Code} />
  </Router>
</main>
