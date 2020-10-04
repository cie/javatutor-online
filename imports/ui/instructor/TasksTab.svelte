<script>
  export let experiment_id
  $: TASKS = Tasks.find({ experiment_id })
</script>

<main class="flex justify-stretch items-stretch">
  <aside class="bg-gray-700 mr-2 p-1 h-full flex-1">No tasks.</aside>
  <aside class="bg-gray-700 p-1 h-full flex-1">No assigned tasks.</aside>
</main>
