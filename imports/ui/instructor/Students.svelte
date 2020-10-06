<script>
  import Tab from './Tab.svelte'
  import tasks from '../../api/tasks.yml'

  export let experiment_id
  $: STUDENTS = Students.find({ experiment_id })
  $: students = $STUDENTS

  import StudentContent from './StudentContent.svelte'
  import StudentHeader from './StudentHeader.svelte'

  let currentStudent
</script>

<article>
  <aside>
    {#each students as student}
      <StudentHeader
        {student}
        {tasks}
        active={student === currentStudent}
        on:select={() => (currentStudent = student)} />
    {:else}No students.{/each}
  </aside>
  <main>
    {#if currentStudent}
      <StudentContent student={currentStudent} {tasks} />
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
