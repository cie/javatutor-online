<script>
  export let experiment_id
  function removeAllStudents() {
    Students.find({ experiment_id })
      .fetch()
      .forEach(student => Students.remove(student._id))
  }
</script>

<input
  type="hidden"
  data-harmony-id="All students"
  on:change={e => {
    if (e.target.value === 'removed') removeAllStudents()
  }} />
