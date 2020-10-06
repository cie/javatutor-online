<script>
  import { createEventDispatcher } from 'svelte'
  export let student
  export let tasks
  export let active
  const dispatch = createEventDispatcher()
  async function deleteAllData() {
    if (!confirm('Delete ALL DATA of this student? This cannot be undone.'))
      return
    await Students.remove(student._id)
  }
  Meteor.subscribe('EventsThat', { student_id: student._id })
  $: events = Events.find(
    { student_id: student._id },
    { sort: { createdAt: 1 } }
  )
  let taskIds, lastTask
  $: {
    const tasksSet = {}
    if ($events) {
      $events.forEach(e => {
        tasksSet[e.task_id] = true
      })
      const lastEvent = $events[$events.length - 1]
      lastTask = lastEvent && tasks.find(t => (t.id = lastEvent.taskId))
    }
    taskIds = Object.keys(tasksSet)
  }
  $: someEvents = $events && $events.length > 0
</script>

<main
  class="hover:bg-gray-800"
  class:bg-gray-800={active}
  on:click={() => dispatch('select')}>
  <h1>{student.nickname}</h1>

  <span class="actionButtons">
    <small>
      {#if $events && lastTask}working on {lastTask.title}{/if}
    </small>
    <br />
    <small>
      {#if $events}{taskIds.length} task{taskIds.length != 1 ? 's' : ''}{/if}
    </small>
    <button on:click={deleteAllData}>
      <i class="fa fa-trash" />
    </button>
  </span>
</main>

<style>
  main {
    width: 100%;
    position: relative;
    cursor: pointer;
    padding: 8px 10px;
  }
  h1 {
    display: inline;
  }
  .actionButtons {
    display: block;
    font-size: 1rem;
    position: absolute;
    right: 10px;
    bottom: 0;
  }
</style>
