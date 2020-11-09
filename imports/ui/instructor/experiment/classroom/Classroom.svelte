<script>
  import tasks from '../../../../tasks.yml'

  export let experiment_id
  $: STUDENTS = Students.find({ experiment_id })
  $: students = $STUDENTS

  import ClassroomStudentContent from './ClassroomStudentContent.svelte'
  import ClassroomStudentHeader from './ClassroomStudentHeader.svelte'

  let currentStudentId
</script>

<input
  type="hidden"
  data-harmony-id="Students"
  value={students.map(s => s.nickname).join(', ')} />

<article>
  <aside>
    {#each students as student}
      <ClassroomStudentHeader
        {student}
        {tasks}
        active={student._id === currentStudentId}
        on:select={() => (currentStudentId = student._id)} />
    {:else}No students.{/each}
  </aside>
  <main>
    {#if currentStudentId}
      <ClassroomStudentContent
        student={students.find(s => s._id === currentStudentId)} />
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
