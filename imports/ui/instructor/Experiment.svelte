<script>
  import { useTracker } from 'meteor/rdb:svelte-meteor-data'
  export let experiment_id
  $: console.log(experiment_id)
  $: EXPERIMENT = useTracker(() => Experiments.findOne(experiment_id))

  function removeAllStudents() {
    Students.find({ experiment_id })
      .fetch()
      .forEach(student => Students.remove(student._id))
  }

  $: STUDENTS = Students.find({ experiment_id })
</script>

{#if $EXPERIMENT}
  <main data-harmony-id="Classroom">
    <nav data-harmony-id="Students">
      {#each $STUDENTS as student}
        <p>{student.nickname}</p>
      {:else}No students{/each}
    </nav>
  </main>
{/if}

<input
  type="hidden"
  data-harmony-id="All students"
  on:change={e => {
    if (e.target.value === 'removed') removeAllStudents()
  }} />
