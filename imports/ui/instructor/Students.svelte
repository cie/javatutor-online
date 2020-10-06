<script>
  import Tab from './Tab.svelte'
  import tasks from '../../api/tasks.yml'

  export let experiment_id
  $: STUDENTS = Students.find({ experiment_id })
  $: students = $STUDENTS

  import StudentContent from './StudentContent.svelte'
  import StudentHeader from './StudentHeader.svelte'

  let currentStudentId
</script>

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
    {#if currentStudentId}
      <StudentContent
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
