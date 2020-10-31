<script>
  import TaskPlayer from './TaskPlayer.svelte'
  export let student
  let task_ids
  let line = ''
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
  $: someEvents = $EVENTS && $EVENTS.length > 0
  let answer
  function sendAnswer() {
    Meteor.call(
      'sendAnswer',
      {
        answer,
        line,
        student_id: student._id,
        task_id: currentTaskId
      },
      (err, res) => {
        if (err) {
          alert(err.message)
          return
        }
        answer = ''
      }
    )
  }
</script>

<section>
  {#if $EVENTS}
    {#if someEvents}
      <nav>
        {#each task_ids as task_id}
          <button
            class="tab mx-2 my-1 outline-none"
            class:active={currentTaskId === task_id}
            class:help={student.helpTaskId === task_id}
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
    {#if student.helpAsked && student.helpTaskId === currentTaskId}
      <p class="text-primary">Asked for help.</p>
      {#if student.problemMessage}
        <p>{student.problemMessage}</p>
      {/if}
    {/if}
    <div
      class="answerForm"
      class:helpAsked={student.helpAsked && student.helpTaskId === currentTaskId}>
      <textarea bind:value={answer} />
      <button
        class="text-primary bg-gray-800 rounded"
        on:click|preventDefault={sendAnswer}>
        Send help
      </button>

      <label>
        <input type="checkbox" />
        Put hint on line
      </label>
      <input class="lineNo" bind:value={line} />
    </div>
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
            <td>{event.value || ''}</td>
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
  }
  textarea,
  input.lineNo {
    background: rgba(255, 255, 255, 0.14);
    outline: none;
    padding: 0.2em 0.4em;
    vertical-align: middle;
  }
  input.lineNo {
    width: 45px;
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
  .tab.help {
    border-bottom: #eaad12 2px solid;
  }
  .tab.active.help {
    border-bottom: #b1820d 2px solid;
  }
  .answerForm.helpAsked {
    border: 8px solid #b1820d;
  }
  td:not(:last-child),
  th:not(:last-child) {
    padding-right: 0.8em;
  }
</style>
