<script>
  import Editor from '../../../Editor.svelte'
  import ChatBox from '../../ChatBox.svelte'
  import tasks from '../../../../tasks.yml'

  export let student
  $: task = tasks.find(t => t.id === student.task_id)
  $: taskTitle = task && task.title
  let selection
  let editor

  let receivedSelection
  let selectionDecorations = []
  $: if (editor && receivedSelection) {
    const newDecorations = isEmpty(receivedSelection)
      ? []
      : [
          {
            options: {
              className: 'bg-primary'
            },
            range: receivedSelection
          }
        ]
    selectionDecorations = editor
      .getModel()
      .deltaDecorations(selectionDecorations, newDecorations)
  }
  function isEmpty(selection) {
    return (
      selection.startLineNumber == selection.endLineNumber &&
      selection.startColumn == selection.endColumn
    )
  }
</script>

<section class="flex">
  {#if student.code}
    <div class="flex-1 flex flex-col">
    {#if student.task_id}
      <p>{taskTitle}</p>
    {/if}
    <Editor
      value={student.code}
      readOnly
      growHeight={false}
      bind:selection
      bind:editor
      uri={`workspace:instructor/${student._id}/Code.java`} />
    </div>
    <div class="h-full" style="flex: 0.45;">
      {#key student._id}
        <ChatBox student_id={student._id} task_id={task.id} closable={false} {selection}  bind:receivedSelection />
      {/key}
    </div>
  {/if}
</section>

<style>
  section {
    border: 4px solid rgba(203,213,224, 1);
    width: 920px;
    flex-shrink: 0.2;
    flex-grow: 1;
  }
</style>
