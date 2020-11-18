<script>
  import tasks from '../../../../tasks.yml'

  export let experiment_id
  $: STUDENTS = Students.find({ experiment_id })
  $: students = $STUDENTS

  import ClassroomStudentContent from './ClassroomStudentContent.svelte'
  import ClassroomStudentHeader from './ClassroomStudentHeader.svelte'

  let currentStudentId
  $: currentStudent = students.find(s => s._id === currentStudentId)

  function hotkey(n) {
    return n < 10
      ? `Alt+${n}`
      : n === 10
      ? `Alt+0`
      : n < 20
      ? `Ctrl+${n - 10}`
      : n === 20
      ? `Ctrl+0`
      : n < 30
      ? `Ctrl+Shift+${n - 20}`
      : n === 30
      ? `Ctrl+Shift+0`
      : null
  }
</script>

<input
  type="hidden"
  data-harmony-id="Students"
  value={students.map(s => s.nickname).join(', ')} />

<article class="flex-1 flex">
  <aside class="overflow-auto" style="width: 210px;">
    {#each students as student, i}
      <ClassroomStudentHeader
        {student}
        {tasks}
        active={student._id === currentStudentId}
        on:select={() => (currentStudentId = student._id)}
        hotkey={hotkey(i + 1)} />
    {:else}No students.{/each}
  </aside>
  <main class="flex-1 flex flex-column">
    {#if currentStudent}
      <ClassroomStudentContent student={currentStudent} />
    {/if}
  </main>
</article>
