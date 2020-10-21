<script>
  import TaskPlayer from './TaskPlayer.svelte'
  export let student
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
  let answer
  function sendAnswer() {
    Meteor.call(
      'sendAnswer',
      {
        answer,
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
  {#if $events}
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
        events={$events
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
      <div class="answerForm">
        <textarea bind:value={answer} />
        <button
          class="text-primary hover:underline"
          on:click|preventDefault={sendAnswer}>
          Send
        </button>
      </div>
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
  textarea {
    background: rgba(255, 255, 255, 0.14);
    outline: none;
    padding: 0.2em 0.4em;
    vertical-align: middle;
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
  .answerForm {
    border: 8px solid #b1820d;
  }
</style>
