<script>
  import TaskPlayer from './TaskPlayer.svelte'
  export let student
  let task_ids
  let currentTaskId
  Meteor.subscribe('EventsThat', { student_id: student._id })
  $: EVENTS = Events.find(
    { student_id: student._id },
    { sort: { createdAt: 1 } }
  )
  $: {
    const tasksSet = {}
    if ($EVENTS) {
      $EVENTS.forEach(e => {
        tasksSet[e.task_id] = true
      })
    }
    task_ids = Object.keys(tasksSet)
    if (!task_ids.some(i => i == currentTaskId)) {
      currentTaskId = task_ids[0]
    }
  }
  $: studentCurrentTaskId = task_ids && task_ids[task_ids.length - 1]
  $: someEvents = $EVENTS && $EVENTS.length > 0
</script>

<section>
  <span class="group">{student.group}</span>
  {#if $EVENTS}
    {#if someEvents}
      <nav>
        {#each task_ids as task_id}
          <button
            class="tab mx-2 my-1 outline-none"
            class:active={currentTaskId === task_id}
            class:studentCurrent={studentCurrentTaskId === task_id}
            on:click={() => {
              currentTaskId = task_id
            }}>
            {task_id}
          </button>
        {/each}
      </nav>
      <TaskPlayer
        {student}
        events={$EVENTS
          .filter(e => e.task_id === currentTaskId)
          .map(e => ({ ...e, sec: +new Date(e.createdAt) / 1000 }))} />
    {:else}
      <p>No code received</p>
    {/if}
    <h1 class="mt-4 mb-2 text-lg">Events</h1>
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Time</th>
          <th>Event type</th>
          <th>Value</th>
          <th>Code</th>
        </tr>
      </thead>
      <tbody>
        {#each $EVENTS.slice().reverse() as event, i}
          <tr>
            <td>{event.task_id}</td>
            <td>{event.createdAt.toISOString()}</td>
            <td>{event.type}</td>
            <td class="whitespace-pre-wrap">{event.value || ''}</td>
            <td>
              {#if event.code != null}
                <button on:click|preventDefault={alert(event.code)}>see</button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}...{/if}
</section>

<style>
  section {
    border: 8px solid #2d3748;
    width: 920px;
    margin-right: 30px;
    flex-shrink: 0.2;
    flex-grow: 1;
    position: relative;
    overflow: auto;
  }
  .group {
    display: block;
    font-size: 0.75rem;
    position: absolute;
    right: 10px;
    top: 0;
  }
  .tab {
    background: none;
    border: none;
    border-bottom: transparent 2px solid;
    outline: none;
    color: #777;
  }
  .tab.studentCurrent {
    color: white;
  }
  .tab.active {
    border-bottom: royalblue 2px solid;
  }
  td:not(:last-child),
  th:not(:last-child) {
    padding-right: 0.8em;
  }
</style>
