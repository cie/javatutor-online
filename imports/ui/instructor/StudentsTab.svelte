<script>
  import Tab from './Tab.svelte'

  export let experiment_id
  $: STUDENTS = Students.find({ experiment_id })

  function removeAllStudents() {
    Students.find({ experiment_id })
      .fetch()
      .forEach(student => Students.remove(student._id))
  }
</script>

<nav class="flex justify-center" data-harmony-id="Students">
  {#each $STUDENTS as student}
    <Tab id={student._id} title={student.nickname} />
  {:else}No students{/each}
</nav>

<input
  type="hidden"
  data-harmony-id="All students"
  on:change={e => {
    if (e.target.value === 'removed') removeAllStudents()
  }} />
