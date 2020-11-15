<script>
  import Editor from '../../../Editor.svelte'
  import ChatBox from '../../ChatBox.svelte'
  import tasks from '../../../../tasks.yml'

  export let student
  $: task = tasks.find(t => t.id === student.task_id)
  $: taskTitle = task && task.title
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
      uri={`workspace:instructor/${student._id}/Code.java`} />
    </div>
    <div class="h-full" style="flex: 0.45;">
      {#key student._id}
        <ChatBox student_id={student._id} task_id={task.id} closable={false} />
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
