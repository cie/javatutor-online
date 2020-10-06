<script>
  import TaskPlayer from './TaskPlayer.svelte'
  export let student
  export let tasks
  let task_ids
  let currentTaskId
  Meteor.subscribe('EventsThat', { student_id: student._id })
  $: events = Events.find(
    { student_id: student._id },
    { sort: { createdAt: 1 } }
  )
  $: {
    const tasksSet = {}
    if ($events) {
      $events.forEach(e => {
        tasksSet[e.task_id] = true
      })
    }
    task_ids = Object.keys(tasksSet)
    if (!task_ids.some(i => i == currentTaskId)) {
      currentTaskId = task_ids[0]
    }
  }
  $: someEvents = $events && $events.length > 0
</script>

<section>
  {#if $events}
    {#if someEvents}
      <nav>
        {#each task_ids as task_id}
          <button
            class="tab mx-2 my-1 outline-none"
            class:active={currentTaskId === task_id}
            on:click={() => {
              currentTaskId = task_id
            }}>
            {task_id}
          </button>
        {/each}
      </nav>
      <TaskPlayer
        {student}
        events={$events
          .filter(e => e.task_id === currentTaskId)
          .map(e => ({ ...e, sec: +new Date(e.createdAt) / 1000 }))} />
    {:else}
      <p>No code received</p>
    {/if}
  {:else}...{/if}
</section>

<style>
  section {
    border: 8px solid #2d3748;
    width: 920px;
    margin-right: 30px;
    flex-shrink: 0.2;
  }
  .tab {
    background: none;
    border: none;
    border-bottom: transparent 2px solid;
    outline: none;
  }
  .tab.active {
    border-bottom: royalblue 2px solid;
  }
</style>
