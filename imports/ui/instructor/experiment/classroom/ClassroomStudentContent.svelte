<script>
  export let student
  let line = ''
  let currentTaskId
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
  <pre>{student.code}</pre>
  {#if student.helpAsked && student.helpTaskId === currentTaskId}
    <p class="text-primary">Asked for help.</p>
    {#if student.problemMessage}
      <p>{student.problemMessage}</p>
    {/if}
  {/if}
  <div
    class="answerForm"
    class:helpAsked={student.helpAsked && student.helpTaskId === currentTaskId}>
    <textarea bind:value={answer} cols="40" />
    <button
      class="text-primary bg-gray-800 rounded"
      on:click|preventDefault={sendAnswer}>
      Send help
    </button>

    <!--
      <label>
        <input type="checkbox" />
        Put hint on line
      </label>
      <input class="lineNo" bind:value={line} />-->
  </div>
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
</style>
