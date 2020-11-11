<script>
  import tasks from '../../../../tasks.yml'

  export let experiment_id
  $: STUDENTS = Students.find({ experiment_id })
  $: students = $STUDENTS

  import StudentContent from './ResultsStudentContent.svelte'
  import StudentHeader from './ResultsStudentHeader.svelte'

  let currentStudentId
  $: currentStudent = students.find(s => s._id === currentStudentId)
</script>

<input
  type="hidden"
  data-harmony-id="Students"
  value={students.map(s => s.nickname).join(', ')} />

<article>
  <aside>
    {#each students as student}
      <StudentHeader
        {student}
        {tasks}
        active={student._id === currentStudentId}
        on:select={() => (currentStudentId = student._id)} />
    {:else}No students.{/each}
  </aside>
  <main>
    {#if currentStudent}
      <StudentContent student={currentStudent} />
    {/if}
  </main>
</article>

<style>
  article {
    display: flex;
  }
  aside {
    width: 210px;
  }
</style>
