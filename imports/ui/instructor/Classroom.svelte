<script>
  $: STUDENTS = Students.find()
  function removeAllStudents() {
    Students.find()
      .fetch()
      .forEach(student => Students.remove(student._id))
  }
</script>

<main data-harmony-id="Classroom">
  <nav data-harmony-id="Students">
    {#each $STUDENTS as student}
      <p>{student.nickname}</p>
    {:else}No students{/each}
  </nav>
</main>

<input
  type="hidden"
  data-harmony-id="All students"
  on:change={e => {
    if (e.target.value === 'removed') removeAllStudents()
  }} />
